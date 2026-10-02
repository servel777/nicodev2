<?php
declare(strict_types=1);

header('Content-Type: application/json; charset=utf-8');

function respond(int $status, array $body): void
{
    http_response_code($status);
    echo json_encode($body, JSON_UNESCAPED_UNICODE);
    exit;
}

function getBotReply(string $message): string
{
    $message = mb_strtolower(trim($message), 'UTF-8');
    $message = strtr($message, [
        'á' => 'a', 'é' => 'e', 'í' => 'i', 'ó' => 'o', 'ú' => 'u', 'ü' => 'u', 'ñ' => 'n',
    ]);
    $message = preg_replace('/[[:punct:]]+/u', ' ', $message) ?? $message;
    $message = trim(preg_replace('/\s+/u', ' ', $message) ?? $message);

    $menu = "Hola, soy el asistente virtual de NICODE. ¿Qué necesitas?\n\n"
        . "1. Soporte técnico\n"
        . "2. Mantenimiento de PC o laptop\n"
        . "3. Instalación de software\n"
        . "4. Redes e internet\n"
        . "5. Impresoras\n"
        . "6. Optimización de equipos\n\n"
        . "Responde con un número o escribe *asesor* para solicitar atención humana.";

    if ($message === '' || preg_match('/^(hola|buenas|buenos dias|buenas tardes|buenas noches|menu|inicio|ayuda)$/u', $message)) {
        return $menu;
    }

    if (preg_match('/\b(asesor|humano|persona|tecnico|técnico|representante)\b/u', $message)) {
        return "De acuerdo. Un asesor de NICODE podrá continuar la atención en este chat. "
            . "Cuéntanos brevemente qué necesitas y, si aplica, el modelo de tu equipo.";
    }

    if (preg_match('/\b(precio|precios|costo|costos|cotizacion|cotizar|presupuesto)\b/u', $message)) {
        return "Para preparar una cotización necesitamos conocer el servicio y el equipo o modelo. "
            . "Descríbenos el problema en este chat y nuestro equipo revisará tu solicitud. "
            . "También puedes responder *asesor* para pedir atención humana.\n\n" . $menu;
    }

    $services = [
        '4' => ['redes e internet', '/\b(red|redes|wifi|internet|router|conexion|conectividad)\b/u'],
        '5' => ['impresoras', '/\b(impresora|impresoras|impresion|escaner|scanner)\b/u'],
        '3' => ['instalación de software', '/\b(software|programa|instalacion|instalar|sistema operativo|windows)\b/u'],
        '6' => ['optimización de equipos', '/\b(optimizacion|lento|lentitud|rendimiento|velocidad)\b/u'],
        '2' => ['mantenimiento de PC o laptop', '/\b(mantenimiento|limpieza)\b/u'],
        '1' => ['soporte técnico', '/\b(soporte|diagnostico|diagnosticar|reparacion|reparar|falla|error|computadora|computador|laptop|portatil|pc)\b/u'],
    ];

    foreach ($services as $number => [$service, $pattern]) {
        if ($message === $number || preg_match($pattern, $message)) {
            return "Con gusto te orientamos con *{$service}*. "
                . "Escribe el modelo de tu equipo y cuéntanos qué problema presenta o qué necesitas realizar. "
                . "Un asesor podrá continuar la atención en este mismo chat.";
        }
    }

    return "Gracias por compartir la información. Puedes escribir *menu* para elegir otro servicio "
        . "o *asesor* para solicitar atención humana. Tu mensaje queda en este chat para que el equipo "
        . "pueda revisarlo.";
}

function extractMessageText(array $message): ?string
{
    $text = $message['text'] ?? [];
    if (is_array($text) && isset($text['body']) && is_string($text['body'])) {
        return $text['body'];
    }

    $button = $message['button'] ?? [];
    if (is_array($button) && isset($button['text']) && is_string($button['text'])) {
        return $button['text'];
    }

    $interactive = $message['interactive'] ?? [];
    if (!is_array($interactive)) {
        return null;
    }
    foreach (['button_reply', 'list_reply'] as $replyType) {
        $reply = $interactive[$replyType] ?? [];
        if (!is_array($reply)) {
            continue;
        }
        if (isset($reply['title']) && is_string($reply['title'])) {
            return $reply['title'];
        }
        if (isset($reply['id']) && is_string($reply['id'])) {
            return $reply['id'];
        }
    }

    return null;
}

function sendWhatsAppMessage(string $recipient, string $message, string $accessToken, string $phoneNumberId, string $apiVersion): bool
{
    if (!function_exists('curl_init')) {
        error_log('WhatsApp webhook requires the PHP cURL extension.');
        return false;
    }

    $payload = json_encode([
        'messaging_product' => 'whatsapp',
        'recipient_type' => 'individual',
        'to' => $recipient,
        'type' => 'text',
        'text' => ['preview_url' => false, 'body' => $message],
    ], JSON_UNESCAPED_UNICODE);

    if ($payload === false) {
        error_log('WhatsApp webhook could not encode an outgoing message.');
        return false;
    }

    $url = "https://graph.facebook.com/{$apiVersion}/{$phoneNumberId}/messages";
    $curl = curl_init($url);
    if ($curl === false) {
        error_log('WhatsApp webhook could not initialize cURL.');
        return false;
    }

    curl_setopt_array($curl, [
        CURLOPT_POST => true,
        CURLOPT_RETURNTRANSFER => true,
        CURLOPT_HTTPHEADER => [
            'Authorization: Bearer ' . $accessToken,
            'Content-Type: application/json',
        ],
        CURLOPT_POSTFIELDS => $payload,
        CURLOPT_CONNECTTIMEOUT => 5,
        CURLOPT_TIMEOUT => 15,
    ]);

    $response = curl_exec($curl);
    $status = (int) curl_getinfo($curl, CURLINFO_HTTP_CODE);
    if ($response === false) {
        error_log('WhatsApp Graph API request failed: ' . curl_error($curl));
        curl_close($curl);
        return false;
    }
    curl_close($curl);

    if ($status < 200 || $status >= 300) {
        error_log('WhatsApp Graph API returned HTTP ' . $status . '.');
        return false;
    }

    return true;
}

$method = $_SERVER['REQUEST_METHOD'] ?? '';
if ($method === 'GET') {
    $verifyToken = getenv('META_WHATSAPP_VERIFY_TOKEN');
    $mode = $_GET['hub_mode'] ?? '';
    $providedToken = $_GET['hub_verify_token'] ?? '';
    $challenge = $_GET['hub_challenge'] ?? '';

    if ($mode === 'subscribe' && is_string($verifyToken) && $verifyToken !== ''
        && is_string($providedToken) && hash_equals($verifyToken, $providedToken)
        && is_string($challenge)) {
        header('Content-Type: text/plain; charset=utf-8');
        echo $challenge;
        exit;
    }

    respond(403, ['success' => false, 'message' => 'Verificación del webhook rechazada.']);
}

if ($method !== 'POST') {
    header('Allow: GET, POST');
    respond(405, ['success' => false, 'message' => 'Método no permitido.']);
}

$appSecret = getenv('META_WHATSAPP_APP_SECRET');
$signature = $_SERVER['HTTP_X_HUB_SIGNATURE_256'] ?? '';
if (!is_string($appSecret) || $appSecret === '' || !is_string($signature)) {
    error_log('WhatsApp webhook signature configuration is missing.');
    respond(500, ['success' => false, 'message' => 'El webhook no está configurado.']);
}

$rawBody = file_get_contents('php://input');
if ($rawBody === false) {
    respond(400, ['success' => false, 'message' => 'No se pudo leer la solicitud.']);
}

$expectedSignature = 'sha256=' . hash_hmac('sha256', $rawBody, $appSecret);
if (!hash_equals($expectedSignature, $signature)) {
    respond(403, ['success' => false, 'message' => 'Firma del webhook no válida.']);
}

$payload = json_decode($rawBody, true);
if (!is_array($payload) || json_last_error() !== JSON_ERROR_NONE) {
    respond(400, ['success' => false, 'message' => 'JSON no válido.']);
}

$entries = $payload['entry'] ?? [];
if (!is_array($entries)) {
    respond(400, ['success' => false, 'message' => 'Estructura de webhook no válida.']);
}

$incomingMessages = [];
foreach ($entries as $entry) {
    if (!is_array($entry) || !is_array($entry['changes'] ?? [])) {
        respond(400, ['success' => false, 'message' => 'Estructura de webhook no válida.']);
    }
    foreach ($entry['changes'] ?? [] as $change) {
        if (!is_array($change) || !is_array($change['value'] ?? [])) {
            respond(400, ['success' => false, 'message' => 'Estructura de webhook no válida.']);
        }
        $messages = $change['value']['messages'] ?? [];
        if (!is_array($messages)) {
            respond(400, ['success' => false, 'message' => 'Estructura de webhook no válida.']);
        }
        foreach ($messages as $message) {
            if (!is_array($message)) {
                respond(400, ['success' => false, 'message' => 'Mensaje de webhook no válido.']);
            }
            $recipient = $message['from'] ?? '';
            if (!is_string($recipient) || !preg_match('/^\d{5,20}$/', $recipient)) {
                continue;
            }
            $incomingMessages[] = [$recipient, extractMessageText($message)];
        }
    }
}

if (!$incomingMessages) {
    respond(200, ['success' => true]);
}

$accessToken = getenv('META_WHATSAPP_ACCESS_TOKEN');
$phoneNumberId = getenv('META_WHATSAPP_PHONE_NUMBER_ID');
$apiVersion = getenv('META_WHATSAPP_GRAPH_API_VERSION');
if (!is_string($accessToken) || $accessToken === ''
    || !is_string($phoneNumberId) || !preg_match('/^\d+$/', $phoneNumberId)
    || !is_string($apiVersion) || !preg_match('/^v\d+\.\d+$/', $apiVersion)) {
    error_log('WhatsApp webhook API configuration is missing or invalid.');
    respond(500, ['success' => false, 'message' => 'La conexión con WhatsApp no está configurada.']);
}

foreach ($incomingMessages as [$recipient, $text]) {
    $reply = is_string($text)
        ? getBotReply(mb_substr($text, 0, 2000, 'UTF-8'))
        : 'Por ahora puedo atender mensajes de texto. Cuéntanos qué necesitas o escribe *asesor* para solicitar atención humana.';

    if (!sendWhatsAppMessage($recipient, $reply, $accessToken, $phoneNumberId, $apiVersion)) {
        respond(502, ['success' => false, 'message' => 'No se pudo enviar la respuesta de WhatsApp.']);
    }
}

respond(200, ['success' => true]);

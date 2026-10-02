<?php
declare(strict_types=1);

header('Content-Type: application/json; charset=utf-8');

if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
    http_response_code(405);
    echo json_encode(['success' => false, 'message' => 'Método no permitido.']);
    exit;
}

$name = trim((string) ($_POST['name'] ?? ''));
$phone = trim((string) ($_POST['phone'] ?? ''));
$service = trim((string) ($_POST['service'] ?? ''));
$message = trim((string) ($_POST['message'] ?? ''));

if ($name === '' || $phone === '' || $service === '' || $message === '') {
    http_response_code(422);
    echo json_encode(['success' => false, 'message' => 'Completa todos los campos obligatorios.']);
    exit;
}

if (mb_strlen($name) > 120 || mb_strlen($phone) > 40 || mb_strlen($service) > 120 || mb_strlen($message) > 2000) {
    http_response_code(422);
    echo json_encode(['success' => false, 'message' => 'Uno de los campos supera el tamaño permitido.']);
    exit;
}

$targetPhoneNumber = '59172558600';

$lines = [
    'Hola NICODE, quiero solicitar una cotización.',
    '',
    "*Nombre:* {$name}",
    "*WhatsApp:* {$phone}",
    "*Servicio:* *{$service}*",
    "*Necesidad:* {$message}",
];

echo json_encode([
    'success' => true,
    'whatsapp_url' => 'https://wa.me/' . $targetPhoneNumber . '?text=' . rawurlencode(implode("\n", $lines)),
]);

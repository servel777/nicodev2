# Activar el bot de WhatsApp

El sitio incluye un asistente interactivo que prepara una solicitud y la entrega al cliente para que la envíe por WhatsApp. El webhook de `whatsapp-webhook.php` añade respuestas automáticas por menú y palabras clave a los mensajes entrantes de WhatsApp Cloud API. No usa inteligencia artificial; los mensajes que no reconoce muestran el menú y permiten pedir atención humana en el mismo chat.

## Requisitos

- Un sitio publicado con HTTPS y PHP 7.4 o superior.
- Las extensiones PHP `curl` y `mbstring`.
- Una aplicación de Meta con WhatsApp Cloud API y un número habilitado.
- El campo `messages` suscrito en los webhooks de la aplicación.

## Variables de entorno del servidor

Configura estas variables en el panel del hosting o en el administrador de procesos del servidor. No guardes los valores en archivos públicos, JavaScript, Git ni en mensajes compartidos.

| Variable | Valor |
| --- | --- |
| `META_WHATSAPP_VERIFY_TOKEN` | Secreto aleatorio que crearás y usarás también al registrar el webhook en Meta. |
| `META_WHATSAPP_ACCESS_TOKEN` | Token de acceso de la API de WhatsApp, guardado solo en el servidor. |
| `META_WHATSAPP_PHONE_NUMBER_ID` | ID del número de teléfono de WhatsApp en Meta; no es el número telefónico. |
| `META_WHATSAPP_APP_SECRET` | Secreto de la aplicación de Meta, usado para comprobar la firma de cada evento. |
| `META_WHATSAPP_GRAPH_API_VERSION` | Versión de Graph API que tu aplicación tenga habilitada, con formato `vN.N`. |

Después de guardar las variables, reinicia PHP-FPM o el proceso PHP de tu hosting si corresponde.

## Registrar el webhook

1. Publica `whatsapp-webhook.php` en el sitio y copia su URL HTTPS completa, por ejemplo `https://tu-dominio.com/whatsapp-webhook.php`.
2. En la configuración de webhooks de tu aplicación de Meta, usa esa URL como callback y el mismo valor de `META_WHATSAPP_VERIFY_TOKEN` como token de verificación.
3. Suscribe la aplicación al campo `messages` de WhatsApp Business Account.
4. Envía un mensaje de prueba desde otro teléfono al número conectado. Prueba `hola`, los números `1` a `6`, `precio` y `asesor`.
5. Confirma que la respuesta automática aparece en el mismo chat y revisa los registros privados del servidor si Meta informa un error.

El endpoint valida la firma `X-Hub-Signature-256` con el secreto de la aplicación antes de aceptar eventos y no expone los tokens en las respuestas. Las respuestas automáticas son mensajes de texto para conversaciones iniciadas por el cliente; las conversaciones fuera de la ventana de atención de WhatsApp requieren las plantillas aprobadas por Meta.

Comprueba que `META_WHATSAPP_PHONE_NUMBER_ID` pertenezca al mismo número `+591 72558600` que usa el sitio. El bot puede orientar y responder preguntas básicas, pero este proyecto no incluye una bandeja de entrada para agentes: conecta ese número a WhatsApp Business o a un CRM compatible con Cloud API para que una persona pueda ver y continuar la conversación cuando el cliente solicite un asesor.

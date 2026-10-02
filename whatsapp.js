document.getElementById('quoteForm').addEventListener('submit', function (e) {
  e.preventDefault();

  const targetphonenumber = "59172558600";

  const name = document.getElementById('name').value.trim();
  const phone = document.getElementById('phone').value.trim();
  const service = document.getElementById('service').value;
  const message = document.getElementById('message').value.trim();

  if (!name || !phone || !service) {
    alert('Por favor, completa los campos obligatorios.');
    return;
  }

  const lines = [
    '=============================',
    '🛠️ *NUEVA SOLICITUD DE SERVICIO*',
    '=============================',
    '',
    `👤 *Cliente:* ${name}`,
    `📱 *Teléfono:* ${phone}`,
    `💻 *Servicio solicitado:* *${service}*`
  ];

  if (message) {
    lines.push(
      '',
      '---------------------------------------------',
      '📝 *Detalle del requerimiento:*',
      `_${message}_`
    );
  }

  lines.push('', '=============================');

  const rawtext = lines.join('\n');
  const encodedmessage = encodeURIComponent(rawtext);

  const whatsappURL = `https://api.whatsapp.com/send?phone=${targetphonenumber}&text=${encodedmessage}`;

  window.open(whatsappURL, '_blank', 'noopener,noreferrer');
});

# Configuração do EmailJS

Para o sistema de envio de emails funcionar, você precisa configurar o EmailJS:

## 1. Criar conta no EmailJS
Acesse: https://www.emailjs.com/ e crie uma conta gratuita (até 200 emails/mês)

## 2. Criar um Service
1. No painel do EmailJS, vá em "Email Services"
2. Clique em "Add New Service"
3. Escolha seu provedor de email (Gmail, Outlook, etc)
4. Siga as instruções para conectar sua conta
5. Copie o **Service ID**

## 3. Criar um Template
1. Vá em "Email Templates"
2. Clique em "Create New Template"
3. Use o seguinte modelo:

**Assunto:** Resposta à sua sugestão - ToyVerse 3D

**Corpo:**
```
Olá {{to_name}}!

Obrigado por sua sugestão sobre: "{{toy_type}}"

Sua mensagem:
"{{original_suggestion}}"

Nossa resposta:
{{reply_message}}

Atenciosamente,
Equipe ToyVerse 3D
```

4. Copie o **Template ID**

## 4. Obter Public Key
1. Vá em "Account" > "General"
2. Copie a **Public Key**

## 5. Configurar no Código
Abra o arquivo `src/components/EmailReplyModal.tsx` e substitua:

```javascript
await emailjs.send(
  'service_toyverse', // Substitua pelo seu Service ID
  'template_reply', // Substitua pelo seu Template ID
  templateParams,
  'YOUR_PUBLIC_KEY' // Substitua pela sua Public Key
);
```

## Variáveis do Template
- `{{to_name}}` - Nome do destinatário
- `{{to_email}}` - Email do destinatário
- `{{from_name}}` - Nome do remetente
- `{{subject}}` - Assunto do email
- `{{original_suggestion}}` - Sugestão original do cliente
- `{{toy_type}}` - Tipo de brinquedo
- `{{reply_message}}` - Sua resposta

## Testando
1. Acesse o painel admin
2. Vá em "Sugestões"
3. Clique em "Responder por E-mail"
4. Escreva sua resposta e clique em "Enviar Resposta"

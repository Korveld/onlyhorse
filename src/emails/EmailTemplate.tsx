import React from 'react';

interface EmailTemplateProps {
  name: string;
  message: string;
}

const EmailTemplate: React.FC<EmailTemplateProps> = ({ name, message }) => {
  return (
    <div>
      <h1>Hello, {name}!</h1>
      <p>{message}</p>
      <p>Best regards,<br />Your Company</p>
    </div>
  );
};

export default EmailTemplate;

"use client";

import Image from "next/image";

type Props = {
  phone: string;
};

const encodeMessage = (text: string) => encodeURIComponent(text);

const WhatsAppFloatingButton = ({
  phone,
}: Props) => {
  const message = `Hola, estoy interesado un Reloj`;

  const href = `https://wa.me/${phone}?text=${encodeMessage(message)}`;

  return (
    <a
      href={href}
      target="_blank"
      rel="noopener noreferrer"
      className="fixed bottom-4 right-4 z-50"
    >
      <Image
        src="/whatsapp.png"
        alt="WhatsApp"
        width={60}
        height={60}
        className="rounded-full shadow-lg hover:scale-110 transition-transform duration-200"
      />
    </a>
  );
};

export default WhatsAppFloatingButton;

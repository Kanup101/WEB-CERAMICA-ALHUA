"use client";
import { useI18n } from "@/lib/i18n/provider";
export function FAQAccordion() {
    const { t } = useI18n();
    const faqs = [
        {
            question: t("Hacen envios?"),
            answer: t("Si. Cada pieza se embala con proteccion y los envios se coordinan de forma manual durante esta etapa."),
        },
        {
            question: t("Las piezas son todas iguales?"),
            answer: t("No. Las series pueden repetirse, pero cada pieza conserva pequenas variaciones de forma, tono y textura propias del trabajo manual."),
        },
        {
            question: t("Puedo reservar una pieza unica?"),
            answer: t("Si la pieza tiene stock disponible, podes escribir por WhatsApp para coordinar reserva, retiro o envio."),
        },
        {
            question: t("Como funcionan los talleres online?"),
            answer: t("Los talleres combinan encuentros en vivo, material descargable y acompanamiento. En cada detalle se informa duracion, nivel y materiales necesarios."),
        },
    ];
    return (<div className="divide-y divide-[#DCCAB2] rounded-3xl border border-[#DCCAB2] bg-[#FFF9EF]">
      {faqs.map((faq) => (<details key={faq.question} className="group p-6">
          <summary className="cursor-pointer list-none text-base font-semibold text-[#342A24]">
            <span className="flex items-center justify-between gap-4">
              {faq.question}
              <span className="text-xl text-[#9A6B50] transition group-open:rotate-45" aria-hidden="true">+</span>
            </span>
          </summary>
          <p className="mt-3 text-sm leading-6 text-[#6C5C50]">{faq.answer}</p>
        </details>))}
    </div>);
}

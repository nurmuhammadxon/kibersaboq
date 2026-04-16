import { useRef, useState } from "react";
import { toast } from "sonner";

export function useCertificateDownload(fileName: string) {
    const certRef = useRef<HTMLDivElement>(null);
    const [downloading, setDownloading] = useState(false);

    const download = async () => {
        if (!certRef.current) return;
        setDownloading(true);

        try {
            const html2canvas = (await import("html2canvas")).default;
            const { default: jsPDF } = await import("jspdf");

            const canvas = await html2canvas(certRef.current, {
                scale: 2,
                useCORS: true,
                backgroundColor: null,
            });

            const imgData = canvas.toDataURL("image/png");
            const pdf = new jsPDF({
                orientation: "landscape",
                unit: "px",
                format: [1056, 748],
            });
            pdf.addImage(imgData, "PNG", 0, 0, 1056, 748);
            pdf.save(`${fileName}.pdf`);
            toast.success("PDF yuklab olindi!");
        } catch {
            toast.error("PDF yaratishda xatolik yuz berdi");
        } finally {
            setDownloading(false);
        }
    };

    return { certRef, download, downloading };
}
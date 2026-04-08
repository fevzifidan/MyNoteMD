export default function downloadMyNoteMD(content: string, id: string) {
    const element = document.createElement("a");
    const blob = new Blob([content || ""], { type: "text/plain" });
    element.href = URL.createObjectURL(blob);
    element.download = `${id}.mynotemd`;
    document.body.appendChild(element);
    element.click();
    document.body.removeChild(element);
};
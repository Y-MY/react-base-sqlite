export const isPdfFile = (pdf) => {
    if (!pdf) {
        return false;
    }
    if (!/\.(pdf)$/.test(pdf.toLowerCase())) {
        return false;
    } else {
        return true;
    }
};
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

export function Toast(code) {
    switch (code) {
        case "0":
            toast.info("Dữ liệu của bạn đã được tạo");
            break;
        case "1":
            toast.success("Bạn vui lòng nhập thông tin và thử lại ");
            break;
        case "2":
            toast.success("File hiện tại đã vượt quá 1'30s ");
            break;
        case "3":
            toast.success("Hệ thống không hiểu được audio của bạn");
            break;
        case "4":
            toast.success("Vui lòng nhập đầy đủ thông tin!");
            break;
        default:
            toast.success("...");
            break;
    }
}
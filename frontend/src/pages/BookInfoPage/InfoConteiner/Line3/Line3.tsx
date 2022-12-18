import { useNavigate, useParams } from "react-router-dom";
import { useAppSelector } from "../../../../redux/store"

export function Line3(){
    let authtor = useAppSelector((state)=>state.bookinfo.authtor);
    let bookcount = useAppSelector((state)=>state.bookinfo.bookcount);
    let navigate = useNavigate();
    let {bookname}=useParams();

    return <div className='line3'>
        <span>{authtor}</span>
        <span> {bookcount}
            <div className="book-icon"></div>
        </span>
        <span onClick={()=>navigate(`/edit/${bookname}`)}>редактировать</span>
    </div>
}
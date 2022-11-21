import { useEffect, useRef, useState } from 'react';
import { Link } from 'react-router-dom';
import { getArrayBooks } from '../../api/getarraybooks';
import { Loader } from '../../components/Loader/Loader';
import { BookCardtype, setArrayCard, setsearch,  } from '../../redux/slices/searchSlice';
import { useAppSelector,RootState, useAppDispatch} from '../../redux/store';
import { getTimeControl2 } from '../../Utils/other/timecontrol';
import { BookCard } from './BookCard/bookcard';
import './style.scss';

let timeControl = getTimeControl2(1000);

export default function MainPage(){
    let {arrayCard , searchString } = useAppSelector((state:RootState)=>state.search);
    let status = useAppSelector((state:RootState)=>state.user.userstatus);
    let dispatch = useAppDispatch();

    let[loadend,setloadend]= useState(false);
    let bookCardBox = useRef<HTMLDivElement>(null);

    useEffect(()=>{
        timeControl(searchbooks);
        async function searchbooks(){
            setloadend(false);
            let array = await getArrayBooks(searchString);
            if (array!=='error'){
                setloadend(true);
                dispatch(setArrayCard(array));
            }
        }
    },[searchString]);

    return <div className="MainPage">
        <div className='main-top-line'>
            <div className='main-input'>
                <input type="text" value={searchString} onChange={(e)=>dispatch(setsearch(e.target.value))} placeholder='введите название книги или автора'/>
                <div className='input-icon'></div>
            </div>
            {status!=='user'?<>
                <div className='addbook-icon'>
                    <div></div>
                    <div></div>
                    <Link to={'/edit/newcollection'}></Link>
                </div>
            </>:<></>}
        </div>
        {loadend?
        <>
            <div ref={bookCardBox} className='bookcard-box'>
                {arrayCard.map((book:BookCardtype,index:number)=>{
                    return <BookCard 
                    href={book.href}
                    img={book.img}
                    bookcount={book.bookcount} 
                    authtor={book.authtor} 
                    name={book.name}
                    key={index}
                    />
                })}
            </div>
        </>:<Loader/>}
    </div>
}
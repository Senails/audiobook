import { addcoll } from '../../../redux/slices/EditSlice';
import { RootState, useAppDispatch, useAppSelector } from '../../../redux/store';
import { AddFragment } from '../AddFragment/AddFragment';
import { CollLine } from '../CollLine/CollLine';
import './style.scss';

export function FragmentsEditor(){
    let collections = useAppSelector((state:RootState)=>state.edit.collections);
    let dispatch = useAppDispatch();

    let arrColls = collections.map((elem,i)=>{
        return <CollLine

        books={elem.books}
        name={elem.name}
        num={i}
        key={i}
        />
    })

    return <div className='editor-conteiner'>
        {arrColls}
        <AddFragment onClick={()=>dispatch(addcoll())}/>
    </div>
}
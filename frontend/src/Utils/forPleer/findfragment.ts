import { Book } from "../../types/pleerSlice";

export function FindFragment(bookmap:Book,lenght:number){
    let {bookparts,booklength} = bookmap;

    if (lenght>=booklength){
        return {
            src: bookparts[bookparts.length-1].url,
            lenght: bookparts[bookparts.length-1].lenght,
            activeFragment:bookparts.length-1,
        }
    }

    let mathlenght = lenght+0.01;
    let part =0;
    while (true){
        if ((mathlenght-bookparts[part].lenght)<0){
            break;
        }else{
            mathlenght-=bookparts[part].lenght
            part++;
        }
    }

    let result = {
        src: bookparts[part].url,
        lenght: mathlenght,
        activeFragment:part,
    }

    return result;
}
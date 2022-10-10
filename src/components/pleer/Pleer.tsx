import { useEffect, useRef } from 'react';
import './style.scss';

export function Pleer(){
    let polsunok = useRef<HTMLDivElement>(null);
    let progress = useRef<HTMLDivElement>(null);

    useEffect(()=>{
        let polzik = polsunok.current;
        let line = progress.current;
        if (!polzik) return;
        polzik.addEventListener('mousedown',mousehandler);
        function mousehandler(event:MouseEvent){
            let startX = event.clientX;
            let {left} = polzik!.getBoundingClientRect();

            let allWhidth = polzik?.offsetWidth;
            let WidthLine = startX-left;
            let percentWhidth= Math.floor(WidthLine/allWhidth!*10000)/100;

            // let line:HTMLDivElement = polzik!.querySelector('.progressline')!;
            line!.style.width=percentWhidth+'%';

            document.addEventListener('mousemove',mousemove);
            document.addEventListener('mouseup',mouseup);

            function mousemove(e:MouseEvent){
                let nowX=e.clientX;
                let delta = nowX-startX;

                let resultWidth = WidthLine+delta;

                if (resultWidth<=0) resultWidth=0;
                if (resultWidth>=allWhidth!) resultWidth=allWhidth!;

                let percent = Math.floor(resultWidth/allWhidth!*10000)/100+'%';

                line!.style.width=percent;
            }

            function mouseup(){
                let percentvalue = line!.offsetWidth/polzik!.offsetWidth;
                ResPolzik(percentvalue);

                document.removeEventListener('mousemove',mousemove);
                document.removeEventListener('mouseup',mouseup);
            }
        }



        
        function ResPolzik(PercetRes:number){
            console.log(PercetRes)
        }

        return ()=>{
            polsunok.current?.removeEventListener('mousedown',mousehandler);
        }
    },[])

    return <div className='pleer_layer'>
        <div className='pleer_box'>
            <h1>Чужак</h1>


            <div ref={polsunok} className='progressBar'>
                <div ref={progress} className='progressline'></div>
            </div>
        </div>
    </div>
}
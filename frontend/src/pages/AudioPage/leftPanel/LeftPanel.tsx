import { useState } from 'react';
import { Link } from 'react-router-dom';
import ArrayUI from './arrayUI/ArrayUI';
import './style.scss';

export default function LeftPanel(){
    let [show,setshow]=useState<'hide'|'show'>('hide');

    function showhandler(){
        if (show==='hide'){
            setshow('show');
        }else{
            setshow('hide');
        }
    }

    return <div className={`left-panel ${show}`}>
        <div className='left-button'>
            <Link to={'/'}></Link>
        </div>
        <div className='right-button' onClick={showhandler}>
            <div></div>
            <div></div>
            <div></div>
        </div>
        <div className='contetn-box'>
            <ArrayUI/>
        </div>
    </div>
}
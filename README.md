# Welcome to the fabulous CozyNote Editor

Simple, yet Towerfull : one day it will be !

## EBNF for CozyNote :
    * Non-terminals : 
        * <CozyNote> : 
        * <note> : 
        * <ListParaTh> : Th = Title of type <h>
        * <ListParaTx> : Tx = Titlte of type Tu or To
        * <ParaTh> : 
        * <ParaTu> : Tu = Title of type <ul><li>
        * <ParaTo> : To = Title of type <ol><li>
        * <TitleTh> : 
        * <TitleTu> : 
        * <TitleTo> : 
        * <Txt> : 
        * <Tab> : 
    * <CozyNote> ::= { (<TitleTh> <CozyNote>) (<TitleTh> <Note>) }* ;
    * <Note> ::= <ListParaTh> | <ListParaTu> ;
    * <ListParaTh> ::= <ParaTh>+ ;
    * <ParaTh> ::= <TitleTh>  { (<LigneTh><ListParaTh>?) | (<LigneTh>|<ListParaTu>+) }* ;
    * <TitleTh> ::= <Txt> ;
    * <LigneTh> ::= <Txt> | <Tab> ;
    * <ListParaTx> ::= <ParaTu>+ | <ParaTo>+ ;
    * <ParaTu> ::= <TitleTu> {<LigneLu><ListParaTu>?}* ;
    * <ParaTo> ::= <TitleTo> {<LigneLo><ListParaTo>?}* ;
    * <TitleTu> ::= <Txt> ;
    * <TitleTo> ::= <Txt> ;
    * <LigneTu> ::= <Txt> | <Tab> ;
    * <LigneTo> ::= <Txt> | <Tab> ;
    * <Txt> ::= html text ;
    * <Tab> ::= a table ;

## Connection with html : 
    * <TitleTh>     : <div class="Th-xx" >  // 
    * <TitleTu>     : <div class="Tu-xx" >  // paragraph title of unordered list
    * <TitleTo>     : <div class="To-xx" >  // paragraph title of unordered list
    * <LigneTh>     : <div class="Lh-xx" >  // paragraph line under a Tu
    * <LigneTu>     : <div class="Lu-xx" >  // paragraph line under a Tu
    * <LigneTo>     : <div class="Lo-xx" >  // paragraph line under a To
    * <Txt>         : 
    * <Num>         : 
    * <Tab>         : 
# Welcome to the fabulous CozyNote Editor

Simple, yet Towerfull : one day it will be !


## The main object CNEditor

    * constructor(iframeTarget, callBack) : the editor is set within the specified iframe label.
    * _note_ : an event called "onHistoryChanged" is triggered on the iframe nesting the editor whenever a content's modification occurs and is significant enough. The editor's content should be saved when it happens.
    * getEditorContent() : as expected, return the editor content
    * setEditorContent(mdContent) : same here... change the editor content
    * unDo() : ctrl-z
    * reDo() : ctrl-y
    * tab()  : tab
    * and a lot more...

## Install editor's environment
    1. Clone git repository and install dependancies
        + `git clone https://github.com/Benibur/cozy-note-editor.git`
        + `cd cozy-note-editor`
        + `npm install`
    2. These commands may be necessary... ?
        + `git submodule init`
        + `git submodule update`
    3. Install brunch and build inside of the project directory
        + `sudo npm install brunch -g`
        + `brunch build`


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

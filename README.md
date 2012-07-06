# Welcome to the fabulous CozyNote Editor

Simple, yet powerful : one day it will be !

## Installer l'application
    1. Cloner le dépôt Git, installer les dépendances
        + `git clone https://github.com/Benibur/cozy-note-editor.git`
        + `cd cozy-note-editor`
        + `npm install`
    2. Pas sûr de ce que font ces commandes...
        + `git submodule init`
        + `git submodule update`
    3. Installer brunch et lancer le build (dans le répertoire du projet)
        + `sudo npm install brunch -g`
        + `brunch build`

## EBNF pour CozyNote :
    * Les non-terminaux : <CozyNote> <TitreSo> <TitrePu> <Note> <ListeParaSo> <ListeParaPu> <ParaSo> <ParaPu> <Ligne> <Txt> <Num> <Puce> <Tab>
    * <CozyNote> ::= { (<TitreSo> <CozyNote>) (<TitreSo> <Note>) }* ;
    * <Note> ::= <ListeParaSo> | <ListeParaSo> ;
    * <ListeParaSo> ::= <ParaSo>+ ;
    * <ParaSo> ::= <TitreSo>  {<LigneTh>|<ListeParaSo>}*   {<LigneTh>|<ListeParaPu>}*  ; En fr : 1 titre suivi de 0 à n listes de ParaSo suivi de 0 à n listes de paraPu avec autant de lignes que souhaitées encadrant les listes.
    * <TitreSo> ::= <Puce><Txt> ;
    * <ListeParaPu> ::= <ParaPu>+ ;
    * <ParaPu> ::= <TitrePu> {<Ligne>|<ListeParaPu> }* ; En fr : un titre à puce suivi de 0 à n lignes et Listes de paraPu.
    * <TitrePu> ::= <Num><Txt> ;
    * <LigneTh> ::= <Txt> | <Tab> ;
    * <LigneTu> ::= <Txt> | <Tab> ;
    * <LigneTo> ::= <Txt> | <Tab> ;
    * <Txt> ::= du texte HTML ;
    * <Tab> ::= une table HTML ;

## Proposition de correspondance : 
    * <CozyNote>    : 
    * <Note>        : 
    * <ListeParaSo> : na
    * <ParaSo>      : na
    * <TitreSo>     : <hx class="Th-xx" >  // ou <p class="h-_xx"> si xx est supérieur ou égal à 7.
    * <ListeParaPu> : <ul class="Lu-xx" >  // list of unordered paragraphs (markers)
    * <ListeParaPu> : <ol class="Lo-xx" >  // list of ordered paragraphs (counter)
    * <ParaPu>      : <li class="Pu-xx" >  // paragraph with marker
    * <TitrePu>     : <p  class="Tu-xx" >  // paragraph title of unordered list
    * <LigneTu>     : <p  class="Lu-xx" >  // paragraph line under a Tu
    * <LigneTo>     : <p  class="Lu-xx" >  // paragraph line under a To
    * <Txt>         : todo
    * <Num>         : todo
    * <Puce>        : todo
    * <Tab>         : todo

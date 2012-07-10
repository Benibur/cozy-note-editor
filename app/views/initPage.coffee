{beautify} = require 'views/beautify'
CNEditor = require('views/editor').CNEditor

# Modules de conversion Markdown <--> Cozy
CNcozyToMarkdown = require('views/cozyToMarkdown').CNcozyToMarkdown
CNmarkdownToCozy = require('views/markdownToCozy').CNmarkdownToCozy
cozy2md = new CNcozyToMarkdown()
md2cozy = new CNmarkdownToCozy()
# Module de test auto
AutoTest = require('views/autoTest').AutoTest
checker = new AutoTest()


# attributes of the class
editorBody$  = undefined # body of iframe
editor_head$ = undefined # head of iframe
editor_css$  = undefined # ref to the stylesheet element
# boolean, true if the classe of the line
# is automatically added at the beginning of the line.
editor_doAddClasseToLines = undefined


exports.initPage =  ()->
    $("body").html require('./templates/editor')
    editorIframe$ = $("iframe")

    # callback to execute after editor's initialization
    # the contexte (this) inside the function is the editor
    cb = () ->
       
        # after load, i don't know why, editorBody$ refers still to a body but a "inactivated" one ??? (light blue in ff console)
        # editor_html$ = $("iframe").contents().find("html")
        # editorBody$  = editor_html$.find("body")
        # editorBody$.parent().attr('id','__ed-iframe-html')
        # editorBody$.attr("contenteditable", "true")
        # editorBody$.attr("id","__ed-iframe-body")
        # editor_head$ = editor_html$.find("head")
        # editor_css$  = editor_head$.html('<link href="stylesheets/app.css" rel="stylesheet">')
        
        # initialisation of the controler
        #edCtrl = editorFactory.create( editorIframe$ )

        ### initialisation of the page
        this.replaceContent( require('./templates/content-full') )
        this.replaceContent( require('./templates/content-empty') )
        this.replaceContent( require('./templates/content-full-marker') )
        this.replaceContent( require('./templates/content-shortlines-marker') )
        ###
        this.replaceContent( require('./templates/content-shortlines-all') )
        
        # buttons init, beautify actions
        editorCtrler = this
        editorBody$  = this.editorBody$

        beautify(editorBody$)
        editorBody$.on 'keyup' , ->
            beautify(editorBody$)
        $("#resultBtnBar_coller").on  'click' , ->
            beautify(editorBody$)
        $("#EmptyTextBtn").on "click", () ->
            editorCtrler.replaceContent( require('./templates/content-empty') )
            beautify(editorBody$)        
        $("#SimpleTextBtn").on "click", () ->
            editorCtrler.replaceContent( require('./templates/content-simple') )
            beautify(editorBody$)
        $("#FullTextBtn").on "click", () ->
            editorCtrler.replaceContent( require('./templates/content-full') )
            beautify(editorBody$)        
        # $("#logKeysBtn").on "click", () ->
        #     editorCtrler.replaceContent( require('./templates/contentFull') )
        #     beautify(editorBody$)
        # $("#logRangeBtn").on "click", () ->
        #     editorCtrler.replaceContent( require('./templates/contentFull') )
        #     beautify(editorBody$)
        # $("#printRangeBtn").on "click", () ->
        #     editorCtrler.replaceContent( require('./templates/contentFull') )
        #     beautify(editorBody$)
        $('#contentSelect').on "change" , (e) ->
            console.log "./templates/#{e.currentTarget.value}"
            editorCtrler.replaceContent( require("./templates/#{e.currentTarget.value}") )
            beautify(editorBody$)
        $('#cssSelect').on "change" , (e) ->
            editorCtrler.replaceCSS( e.currentTarget.value )

        #buttons for the editor
        $("#indentBtn").on "click", () ->
            editorCtrler.tab()
        $("#unIndentBtn").on "click", () ->
            editorCtrler.shiftTab()
        $("#markerListBtn").on "click", () ->
            editorCtrler.markerList()
        $("#titleBtn").on "click", () ->
            editorCtrler.titleList()


        # Special buttons (to be removed later)
        #  > tests the code structure
        $("#checkBtn").on "click", () ->
            checker.checkLines(editorCtrler)
        # $("#checkBtn").toggle(
        #     () ->
        #        checking = true
        #        $("#checkBtn").html "Checking ON"
        #    () ->
        #        checking = false
        #        $("#checkBtn").html "Checking OFF"
        #    )
        # editorBody$.on 'keyup' , () ->
        #    if checking
        #        checker.checkLines(editorCtrler)
        #
        #  > translate cozy code into markdown and markdown to cozy code
        #    Note: in the markdown code there should be two \n between each line
        $("#CozyMarkdown").on "click", () ->
            $("#resultText").val(cozy2md.translate $("#resultText").val())
        # $("#CozyMarkdown").toggle (
        #     () ->
        #         $("#CozyMarkdown").html "HTML"
        #         $("#resultText").val(cozy2md.translate $("#resultText").val())
        #     () ->
        #         $("#CozyMarkdown").html "Markdown"
        #         $("#resultText").val(md2cozy.translate $("#resultText").val())
        #     )


        # Restores selection after the iframe has lost focus
        restoreSelection = (sel) =>
            # Let's try and schematize :
            # <div><span>| </span><br></div>
            #  offset <->^
            #            Selection start 
            # ...
            # <div><span>     | </span></div> |
            #       offset <->^               ^offset=1 (1 child between)
            #       (Selection end can be tricky because of offset definition)
            num = sel.rangeCount
            if num == 0
                return
            for i in [0..num-1]
                range = sel.getRangeAt(i)
                
                # and obviously i spent hours trying to build a copy of range...
                # noooooooooooo
                # 
                #selStartContainer       = range.startContainer
                #selStartContainerOffset = range.startOffset
                #selEndContainer         = range.endContainer
                #selEndContainerOffset   = range.endOffset
                # restore selection (Rq : why offset+1 ?? very strange...)
                #myRange = rangy.createRange()
                # there was a +1 below, it shouldnt be here
                #myRange.setStart(selStartContainer, selStartContainerOffset)
                #myRange.setEnd(selEndContainer, selEndContainerOffset)
                #console.log range
                #console.log myRange
                
                sel.setSingleRange(range)
                # sel.setSingleRange(myRange)
                
            beautify(editorBody$)
            
            # it could be nice not to loose the focus when clicking buttons
            # or such outside the inlineframe
            editorBody$.focus()
        
        # returns an object containing every selected line in the iframe
        getSelectedLines = (sel) =>
            myDivs = []
            # 1. Fetches every selected DIVs (thank you Rangy ;-) )
            #    so myDivs contains each of them (eventually several times)
            # 
            # if sthg is selected
            if sel.rangeCount == 0
                return
            # for each selected area
            for i in [0..sel.rangeCount-1]
                range = sel.getRangeAt(i)
                # case of multiline selection (includes always at least one div)
                divs = range.getNodes([1], (element) -> element.tagName=='DIV')
                # if a div's CONTENT was selected
                if divs.length == 0
                    # nasty bug-counter: the whole body can be "selected"
                    #   and we don't do anything if it occurs
                    if range.commonAncestorContainer.tagName != 'BODY'
                        # So... who's the father?
                        node = range.commonAncestorContainer
                        while node.tagName != 'DIV'
                            node = node.parentNode
                        # node is the father
                        divs.push node
                # We fill myDivs whith the encountered DIV
                k = 0
                while k < divs.length
                    myDivs.push $(divs[k])
                    k++

            return myDivs


        # Add the class at beginning of each (selected?) line
        addClassToLines = (mode) =>
            
            sel = rangy.getIframeSelection(this.editorIframe)
            
            if mode == "sel"
                lines = getSelectedLines(sel)
                k = 0
                while k < lines.length
                    div = lines[k]
                    div.attr('toDisplay', div.attr('class') + '] ')
                    k++
                
            else
                lines = this._lines
                for lineID of lines
                    div = $ lines[lineID].line$[0]
                    div.attr('toDisplay', div.attr('class') + '] ')

            restoreSelection(sel)
            
        # Code below was commented, and would allow history selection
        # 
        # OPERATOR = ///  (Th|Tu|To|Lh|Lu|Lo)-\d+\] ///
        # selectedStartContainer = range.startContainer
        # selectedStartContainerOffset = range.startOffset
        # selectedEndContainer = range.endContainer
        # selectedEndContainerOffset = range.endOffset
        # ...
        # spanTextNode = line.line$[0].firstChild.firstChild
        # if no history expected
        # if spanTextNode != null
        #     textOriginal = spanTextNode.textContent
        #     spanTextNode.textContent = "#{line.lineType}-#{line.lineDepthAbs}] " + textOriginal.replace(OPERATOR,"")
        # if history expected
        # span.textContent = "#{line.lineType}-#{line.lineDepthAbs}] " + textOriginal
        # restore selection (Rq : why offset+1 ?? very strange...)
        # range = rangy.createRange()
        # range.setStart(selectedStartContainer,selectedStartContainerOffset+1)
        # range.setEnd(selectedEndContainer,selectedEndContainerOffset+1)
        # sel.setSingleRange(range)
        # beautify(editorBody$)
                
        # Remove the class at beginning of each (selected?) line
        removeClassFromLines = (mode) =>
            
            sel = rangy.getIframeSelection(this.editorIframe)

            if mode == "sel"
                lines = getSelectedLines(sel)
                k = 0
                while k < lines.length
                    div = lines[k]
                    div.attr('toDisplay', '')
                    k++
            else
                lines = this._lines
                for lineID of lines
                    div = $ lines[lineID].line$[0]
                    div.attr('toDisplay', '')
                    
            restoreSelection(sel)
            
        # Code below was commented, and would allow history selection
        # same code treating saving selection management just like addClassToLines

        # active/désactive les classes dvt toutes les lignes
        $("#addClass2LineBtn").on "click", () ->
            addClassToLines()
            if editor_doAddClasseToLines
                $("#addClass2LineBtn").html "Show Class on Lines"
                editor_doAddClasseToLines = false
                editorBody$.off 'keyup' , addClassToLines
                removeClassFromLines()
            else
                $("#addClass2LineBtn").html "Hide Class on Lines"
                editor_doAddClasseToLines = true
                editorBody$.on 'keyup' , addClassToLines

        # bouton qui ajoute les classes dvt les lignes sélectionnées
        $("#addClass").on "click", () ->
            addClassToLines("sel")
        $("#delClass").on "click", () ->
            removeClassFromLines("sel")
            
        # default behaviour regarding the class at the beginning of the line :
        # comment or uncomment depending default expected behaviour
        # addClassToLines()
        # $("#addClass2LineBtn").html "Hide Class on Lines"
        # editorBody$.on 'keyup', addClassToLines
        # editor_doAddClasseToLines = true

        # display whether the user has moved the carret with keyboard or mouse.
        this.editorBody$.on 'mouseup'  , ()->
            this.newPosition = true
            $("#editorPropertiesDisplay").text("newPosition = true")

    # creation of the editor
    editor = new CNEditor( $('#editorIframe')[0], cb )
    return editor

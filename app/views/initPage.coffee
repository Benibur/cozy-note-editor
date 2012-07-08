{beautify} = require 'views/beautify'
CNEditor = require('views/editor').CNEditor

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
        
        # initilisation of the controler
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
        editorBody$ = this.editorBody$

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

            

        
        # Add at the beginning of each line the Class of the line.
        addClass2Line = () =>
            # save the selection
            # TODO : the save & restore of the selection work only if selection
            # is in the  first span. Multiline selection will not be restored.
            # to improve this we should use the following but it doesn't work 
            # in a iframe : improve rangy would be easy :
            #   savedSel = rangy.saveSelection()
            #   rangy.restoreSelection(savedSel)
            sel = rangy.getIframeSelection(this.editorIframe)
            range = sel.getRangeAt(0)
            selectedStartContainer = range.startContainer
            selectedStartContainerOffset = range.startOffset
            selectedEndContainer = range.endContainer
            selectedEndContainerOffset = range.endOffset
            # loop on lines of the editor
            lines = this._lines
            OPERATOR = ///  (Th|Tu|To|Lh|Lu|Lo)-\d+\] ///
            for lineID of lines
                line = lines[lineID]
                spanTextNode = line.line$[0].firstChild.firstChild
                # if no history expected
                if spanTextNode != null
                    textOriginal = spanTextNode.textContent
                    spanTextNode.textContent = "#{line.lineType}-#{line.lineDepthAbs}] " + textOriginal.replace(OPERATOR,"")
                # if history expected
                #span.textContent = "#{line.lineType}-#{line.lineDepthAbs}] " + textOriginal
            # restore selection (Rq : why offset+1 ?? very strange...)
            range = rangy.createRange()
            range.setStart(selectedStartContainer,selectedStartContainerOffset+1)
            range.setEnd(selectedEndContainer,selectedEndContainerOffset+1)
            sel.setSingleRange(range)
            # beautify
            beautify(editorBody$)

        # Remove the class at beginning of each line
        removeClassFromLines = () =>
            # save the selection
            # TODO : the save & restore of the selection work only if selection
            # is in the  first span. Multiline selection will not be restored.
            # to improve this we should use the following but it doesn't work 
            # in a iframe : improve rangy would be easy :
            #   savedSel = rangy.saveSelection()
            #   rangy.restoreSelection(savedSel)
            sel = rangy.getIframeSelection(this.editorIframe)
            range = sel.getRangeAt(0)
            selectedStartContainer = range.startContainer
            selectedStartContainerOffset = range.startOffset
            selectedEndContainer = range.endContainer
            selectedEndContainerOffset = range.endOffset
            # loop on lines of the editor
            lines = this._lines
            OPERATOR = /// (Th|Tu|To|Lh|Lu|Lo)-\d+\] ///
            for lineID of lines
                line = lines[lineID]
                spanTextNode = line.line$[0].firstChild.firstChild
                # if no history expected
                if spanTextNode != null
                    textOriginal = spanTextNode.textContent
                    spanTextNode.textContent = textOriginal.replace(OPERATOR,"")
                # if history expected
                #span.textContent = "#{line.lineType}-#{line.lineDepthAbs}] " + textOriginal
            # restore selection (Rq : why offset+1 ?? very strange...)
            range = rangy.createRange()
            range.setStart(selectedStartContainer,selectedStartContainerOffset+1-6)
            range.setEnd(selectedEndContainer,selectedEndContainerOffset+1-6)
            sel.setSingleRange(range)
            # beautify
            beautify(editorBody$)

        $("#addClass2LineBtn").on "click", () ->
            addClass2Line()
            if editor_doAddClasseToLines
                editor_doAddClasseToLines = false
                editorBody$.off 'keyup' , addClass2Line
                removeClassFromLines()
            else
                editor_doAddClasseToLines = true
                editorBody$.on 'keyup' , addClass2Line

        # default behaviour regarding the class at the beginning of the line :
        # comment or uncomment depending default expected behaviour
        # addClass2Line()
        # editorBody$.on 'keyup' , addClass2Line
        # editor_doAddClasseToLines = true

        # display whether the user has moved the carret with keyboard or mouse.
        this.editorBody$.on 'mouseup'  , ()->
            this.newPosition = true
            $("#editorPropertiesDisplay").text("newPosition = true")

    # creation of the editor
    editor = new CNEditor( $('#editorIframe')[0], cb )
    return editor







    

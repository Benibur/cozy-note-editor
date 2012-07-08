

### ------------------------------------------------------------------------
# CLASS FOR THE COZY NOTE EDITOR
#
# usage : 
#
# newEditor = new CNEditor( iframeTarget,callBack )
#   iframeTarget = iframe where the editor will be nested
#   callBack     = launched when editor ready, the context 
#                  is set to the editorCtrl (callBack.call(this))
# properties & methods :
#   replaceContent    : (htmlContent) ->  # TODO : replace with markdown
#   _keyPressListener : (e) =>
#   _insertLineAfter  : (param) ->
#   _insertLineBefore : (param) ->
#   
#   editorIframe      : the iframe element where is nested the editor
#   editorBody$       : the jquerry pointer on the body of the iframe
#   _lines            : {} an objet, each property refers a line
#   _highestId        : 
#   _firstLine        : pointes the first line : TODO : not taken into account 
###
class exports.CNEditor extends Backbone.View

    ###
    #   Constructor : newEditor = new CNEditor( iframeTarget,callBack )
    #       iframeTarget = iframe where the editor will be nested
    #       callBack     = launched when editor ready, the context 
    #                      is set to the editorCtrl (callBack.call(this))
    ###
    constructor : (iframeTarget,callBack) ->
        #iframe$ = $('<iframe style="width:50%;height:100%"></iframe>').appendTo(iframeTarget)
        #iframe$ = $(iframeTarget).replaceWith('<iframe  style="width:50%;height:100%"></iframe>')
        iframe$ = $(iframeTarget)
        iframe$.on 'load', () =>
            # 1- preparation of the iframe
            editor_html$ = iframe$.contents().find("html")
            editorBody$  = editor_html$.find("body")
            editorBody$.parent().attr('id','__ed-iframe-html')
            editorBody$.attr("contenteditable", "true")
            editorBody$.attr("id","__ed-iframe-body")
            editor_head$ = editor_html$.find("head")
            editor_css$  = editor_head$.html('<link href="stylesheets/app.css" 
                                               rel="stylesheet">')
            # 2- set the properties of the editor
            @editorBody$    = editorBody$
            @editorIframe   = iframe$[0]
            @_lines          = {}
            @_highestId      = 0
            @_firstLine      = null
            # 3- initilize event listeners
            editorBody$.prop( '__editorCtl', this)
            editorBody$.on 'keypress' , @_keyPressListener
            # 4- return a ref to the editor's controler
            callBack.call(this)
            return this


    ### ------------------------------------------------------------------------
    # TODO : initialise the editor content from a markdown string
    ###
    replaceContent : (htmlContent) ->
        @editorBody$.html( htmlContent )
        @_readHtml()

    ###
    # Change the path of the css applied to the editor iframe
    ###
    replaceCSS : (path) ->
        $(this.editorIframe).contents().find("link[rel=stylesheet]").attr({href : path})


    ### ------------------------------------------------------------------------
    #    The listner of keyPress event on the editor's iframe... the king !
    ###
    # 
    # Params :
    # e : the event object. Interesting attributes : 
    #   .which : added by jquery : code of the caracter (not of the key)
    #   .altKey
    #   .ctrlKey
    #   .metaKey
    #   .shiftKey
    #   .keyCode
    ###
    # SHORTCUT
    #
    # Definition of a shortcut : 
    #   a combination alt,ctrl,shift,meta
    #   + one caracter(.which) 
    #   or 
    #     arrow (.keyCode=dghb:) or 
    #     return(keyCode:13) or 
    #     bckspace (which:8) or 
    #     tab(keyCode:9)
    #   ex : shortcut = 'CtrlShift-up', 'Ctrl-115' (ctrl+s), '-115' (s),
    #                   'Ctrl-'
    ###
    # Variables :
    #   metaKeyStrokesCode : ex : ="Alt" or "CtrlAlt" or "CtrlShift" ...
    #   keyStrokesCode     : ex : ="return" or "_102" (when the caracter 
    #                               N°102 f is stroke) or "space" ...
    #
    _keyPressListener : (e) =>
        
        # 1- Prepare the shortcut corresponding to pressed keys
        metaKeyStrokesCode = `(e.altKey ? "Alt" : "") + 
                              (e.ctrlKey ? "Ctrl" : "") + 
                              (e.shiftKey ? "Shift" : "")`
        switch e.keyCode
            when 13 then keyStrokesCode = "return"
            when 35 then keyStrokesCode = "end"
            when 36 then keyStrokesCode = "home"
            when 33 then keyStrokesCode = "pgUp"
            when 34 then keyStrokesCode = "pgDwn"
            when 37 then keyStrokesCode = "left"
            when 38 then keyStrokesCode = "up"
            when 39 then keyStrokesCode = "right"
            when 40 then keyStrokesCode = "down"
            when 9  then keyStrokesCode = "tab"
            when 8  then keyStrokesCode = "backspace"
            when 32 then keyStrokesCode = "space"
            when 27 then keyStrokesCode = "esc"
            when 46 then keyStrokesCode = "suppr"
            else
                switch e.which # TODO : to be deleted if it works with e.keyCode
                    when 32 then keyStrokesCode = "space"  
                    when 8  then keyStrokesCode = "backspace"
                    else  keyStrokesCode = e.which
        shortcut = metaKeyStrokesCode + '-' + keyStrokesCode

        # for tests and check the key and caracter numbers :
        # console.clear()
        # console.log '__keyPressListener____________________________'
        # console.log e
        # console.log "ctrl #{e.ctrlKey}; Alt #{e.altKey}; Shift #{e.shiftKey}; which #{e.which}; keyCode #{e.keyCode}"
        # console.log "metaKeyStrokesCode:'#{metaKeyStrokesCode} keyStrokesCode:'#{keyStrokesCode}'"

        # 2- Test whether position of carret changed
        #    If yes, carret must be in a span
        if @newPosition
            @newPosition = false
            $("#editorPropertiesDisplay").text("newPosition = false")
            sel = rangy.getIframeSelection(@editorIframe)
            div = sel.getRangeAt(0).startContainer
            if div.nodeName != "DIV"
                div = $(div).parents("div")[0]
            if div.innerHTML == "<span></span><br>"
                # Position caret
                range4sel = rangy.createRange()
                range4sel.collapseToPoint(div.firstChild,0)
                sel.setSingleRange(range4sel)

        # 3- Set a flag if the user moved the carret with keyboard
        if keyStrokesCode in ["left","up","right","down","pgUp","pgDwn","end",
                              "home"] and 
                              shortcut not in ['CtrlShift-down','CtrlShift-up']
            @newPosition = true
            $("#editorPropertiesDisplay").text("newPosition = true")
       
       # 4- launch the action corresponding to the pressed shortcut
        switch shortcut

            # RETURN                            
            when "-return"
                @_return()
                e.preventDefault()
            
            # TAB                               
            when "-tab"
                @tab()
                e.preventDefault()
            
            # BACKSPACE                               
            when "-backspace"
                # TODO : deal case of a selection in a single line and in an empty line.
                @_deleteMultiLinesSelections()
                e.preventDefault()
            
            # SUPPR                    
            when "-suppr"
                # TODO : deal case of a selection in a single line and in an empty line.
                @_deleteMultiLinesSelections()
                e.preventDefault()
            
            # TOGGLE LINE TYPE (Alt + a)                  
            when "Shift-tab"
                @shiftTab()
                e.preventDefault()
            
            # TOGGLE LINE TYPE (Alt + a)                  
            when "Alt-97"
                @_toggleLineType()
                e.preventDefault()
            
            # PASTE (Ctrl + c)                  
            when "Ctrl-118"
                # TODO
                # console.log "TODO : PASTE"
                e.preventDefault()
            
            # SAVE (Ctrl + s)                  
            when "Ctrl-115"
                # TODO
                # console.log "TODO : SAVE"
                e.preventDefault()


    ### ------------------------------------------------------------------------
    #  Turn selected lines in a title List (Th)
    ###
    titleList : () ->
        # 1- Variables
        sel                = rangy.getIframeSelection(@editorIframe)
        range              = sel.getRangeAt(0)
        startContainer     = range.startContainer
        endContainer       = range.endContainer
        initialStartOffset = range.startOffset
        initialEndOffset   = range.endOffset
        # 2- find first and last div corresponding to the 1rst and
        #    last selected lines
        startDiv = startContainer
        if startDiv.nodeName != "DIV"
            startDiv = $(startDiv).parents("div")[0]
        endDiv = endContainer
        if endDiv.nodeName != "DIV"
            endDiv = $(endDiv).parents("div")[0]
        endLineID = endDiv.id
        # 3- loop on each line between the firts and last line selected
        # TODO : deal the case of a multi range (multi selections). 
        #        Currently only the first range is taken into account.
        line = @_lines[startDiv.id]
        endDivID = endDiv.id
        loop
            @_line2titleList(line)
            if line.lineID == endDivID
                break
            else 
                line = line.lineNext


    ### ------------------------------------------------------------------------
    #  Turn a given line in a title List Line (Th)
    ###
    _line2titleList : (line)->
        if line.lineType != 'Th'
            if line.lineType[0] =='L'
                line.lineType = 'Tu'
                line.lineDepthAbs +=1    
            @_titilizeSiblings(line)
            parent1stSibling = @_findParent1stSibling(line)
            while parent1stSibling!=null and parent1stSibling.lineType!='Th'
                @_titilizeSiblings(parent1stSibling)
                parent1stSibling = @_findParent1stSibling(parent1stSibling)


    ### ------------------------------------------------------------------------
    #  Turn selected lines in a Marker List
    ###
    markerList : (l) ->
        # 1- Variables
        if l? 
            startDivID = l.lineID
            endLineID  = startDivID
        else
            range              = rangy.getIframeSelection(@editorIframe).getRangeAt(0)
            endContainer       = 
            initialStartOffset = range.startOffset
            initialEndOffset   = range.endOffset
            # 2- find first and last div corresponding to the 1rst and
            #    last selected lines
            startDiv = range.startContainer
            if startDiv.nodeName != "DIV"
                startDiv = $(startDiv).parents("div")[0]
            startDivID =  startDiv.id
            endDiv = range.endContainer
            if endDiv.nodeName != "DIV"
                endDiv = $(endDiv).parents("div")[0]
            endLineID = endDiv.id
        # 3- loop on each line between the firts and last line selected
        # TODO : deal the case of a multi range (multi selections). 
        #        Currently only the first range is taken into account.
        line = @_lines[startDivID]
        loop
            switch line.lineType
                when 'Th'
                    lineTypeTarget = 'Tu'
                    # transform all next Th & Lh siblings in Tu & Lu
                    l = line.lineNext
                    while l!=null and l.lineDepthAbs >= line.lineDepthAbs
                        switch l.lineType
                            when 'Th'
                                l.line$.prop("class","Tu-#{l.lineDepthAbs}")
                                l.lineType = 'Tu'
                                l.lineDepthRel = @_findDepthRel(l)
                            when 'Lh'
                                l.line$.prop("class","Lu-#{l.lineDepthAbs}")
                                l.lineType = 'Lu'
                                l.lineDepthRel = @_findDepthRel(l)
                        l=l.lineNext
                    # transform all previous Th &vLh siblings in Tu & Lu
                    l = line.linePrev
                    while l!=null and l.lineDepthAbs >= line.lineDepthAbs
                        switch l.lineType
                            when 'Th'
                                l.line$.prop("class","Tu-#{l.lineDepthAbs}")
                                l.lineType = 'Tu'
                                l.lineDepthRel = @_findDepthRel(l)
                            when 'Lh'
                                l.line$.prop("class","Lu-#{l.lineDepthAbs}")
                                l.lineType = 'Lu'
                                l.lineDepthRel = @_findDepthRel(l)
                        l=l.linePrev
                when 'Lh', 'Lu'
                    # remember : the default indentation action is to make 
                    # a marker list, that's why it works here.
                    @tab(line) 
                else
                    lineTypeTarget = false
            # TODO: à supprimer en mettant commençant les boucles par la ligne elle meme et non la suivante
            if lineTypeTarget 
                line.line$.prop("class","#{lineTypeTarget}-#{line.lineDepthAbs}")
                line.lineType = lineTypeTarget
            if line.lineID == endLineID
                break
            else 
                line = line.lineNext


    ### ------------------------------------------------------------------------
    # Calculates the relative depth of the line
    #   usage   : cycle : Tu => To => Lx => Th
    #   param   : line : the line we want to find the relative depth
    #   returns : a number
    # 
    ###
    _findDepthRel : (line) ->
        if line.lineDepthAbs == 1
            if line.lineType[1] == "h"
                return 0
            else
                return 1
        else 
            linePrev = line.linePrev
            while linePrev.lineDepthAbs >= line.lineDepthAbs
                linePrev = linePrev.linePrev
            return linePrev.lineDepthRel+1


    ### ------------------------------------------------------------------------
    # Toggle line type
    #   usage : cycle : Tu => To => Lx => Th
    #   param :
    #       e = event
    ###
    _toggleLineType : () ->
        # 1- Variables
        sel                = rangy.getIframeSelection(@editorIframe)
        range              = sel.getRangeAt(0)
        startContainer     = range.startContainer
        endContainer       = range.endContainer
        initialStartOffset = range.startOffset
        initialEndOffset   = range.endOffset
        # 2- find first and last div corresponding to the 1rst and
        #    last selected lines
        startDiv = startContainer
        if startDiv.nodeName != "DIV"
            startDiv = $(startDiv).parents("div")[0]
        endDiv = endContainer
        if endDiv.nodeName != "DIV"
            endDiv = $(endDiv).parents("div")[0]
        endLineID = endDiv.id
        # 3- loop on each line between the firts and last line selected
        # TODO : deal the case of a multi range (multi selections). 
        #        Currently only the first range is taken into account.
        line = @_lines[startDiv.id]
        loop
            switch line.lineType
                when 'Tu' # can be turned in a Th only if his parent is a Th
                    lineTypeTarget = 'Th'
                    # transform all its siblings in Th
                    l = line.lineNext 
                    while l!=null and l.lineDepthAbs >= line.lineDepthAbs
                        if l.lineDepthAbs == line.lineDepthAbs
                            if l.lineType == 'Tu'
                                l.line$.prop("class","Th-#{line.lineDepthAbs}")
                                l.lineType = 'Th'
                            else
                                l.line$.prop("class","Lh-#{line.lineDepthAbs}")
                                l.lineType = 'Lh'
                        l=l.lineNext
                    l = line.linePrev 
                    while l!=null and l.lineDepthAbs >= line.lineDepthAbs
                        if l.lineDepthAbs == line.lineDepthAbs
                            if l.lineType == 'Tu'
                                l.line$.prop("class","Th-#{line.lineDepthAbs}")
                                l.lineType = 'Th'
                            else
                                l.line$.prop("class","Lh-#{line.lineDepthAbs}")
                                l.lineType = 'Lh'
                        l=l.linePrev

                when 'Th'
                    lineTypeTarget = 'Tu'
                    # transform all its siblings in Tu
                    l = line.lineNext
                    while l!=null and l.lineDepthAbs >= line.lineDepthAbs
                        if l.lineDepthAbs == line.lineDepthAbs
                            if l.lineType == 'Th'
                                l.line$.prop("class","Tu-#{line.lineDepthAbs}")
                                l.lineType = 'Tu'
                            else
                                l.line$.prop("class","Lu-#{line.lineDepthAbs}")
                                l.lineType = 'Lu'
                        l=l.lineNext
                    l = line.linePrev
                    while l!=null and l.lineDepthAbs >= line.lineDepthAbs
                        if l.lineDepthAbs == line.lineDepthAbs
                            if l.lineType == 'Th'
                                l.line$.prop("class","Tu-#{line.lineDepthAbs}")
                                l.lineType = 'Tu'
                            else
                                l.line$.prop("class","Lu-#{line.lineDepthAbs}")
                                l.lineType = 'Lu'
                        l=l.linePrev
                # when 'Lh'
                #     lineTypeTarget = 'Th'
                # when 'Lu'
                #     lineTypeTarget = 'Tu'
                else
                    lineTypeTarget = false
            if lineTypeTarget 
                line.line$.prop("class","#{lineTypeTarget}-#{line.lineDepthAbs}")
                line.lineType = lineTypeTarget
            if line.lineID == endDiv.id
                break
            else 
                line = line.lineNext


    ### ------------------------------------------------------------------------
    # tab keypress
    #   l = optional : a line to indent. If none, the selection will be indented
    ###
    tab :  (l) ->
        # 1- Variables
        if l? 
            startDiv = l.line$[0]
            endDiv   = startDiv
        else
            sel      = rangy.getIframeSelection(@editorIframe)
            range    = sel.getRangeAt(0)
            startDiv = range.startContainer
            endDiv   = range.endContainer

        # 2- find first and last div corresponding to the 1rst and
        #    last selected lines
        if startDiv.nodeName != "DIV"
            startDiv = $(startDiv).parents("div")[0]
        if endDiv.nodeName != "DIV"
            endDiv = $(endDiv).parents("div")[0]
        endLineID = endDiv.id
        # 3- loop on each line between the firts and last line selected
        # TODO : deal the case of a multi range (multi selections). 
        #        Currently only the first range is taken into account.
        line = @_lines[startDiv.id]
        loop
            switch line.lineType
                when 'Tu','Th'
                    # find previous sibling to check if a tab is possible.
                    linePrevSibling = @_findPrevSibling(line)
                    if linePrevSibling == null
                        isTabAllowed=false
                    else 
                        isTabAllowed=true
                        # determine new lineType
                        if linePrevSibling.lineType == 'Th'
                            lineTypeTarget = 'Lh'
                        else 
                            if linePrevSibling.lineType == 'Tu'
                                lineTypeTarget = 'Lu'
                            else
                                lineTypeTarget = 'Lo'
                            if line.lineType == 'Th'
                                # in case of a Th => Lx then all the following 
                                # siblings must be turned to Tx and Lh into Lx
                                # TODO : test this case...
                                # first we must find the previous sibling line                                
                                # linePrevSibling = @_findPrevSibling(line)
                                # linePrev = line.linePrev
                                # while linePrev.lineDepthAbs > firstChild
                                #     textContent
                                lineNext = line.lineNext
                                while lineNext != null and lineNext.lineDepthAbs > line.lineDepthAbs
                                    switch lineNext.lineType
                                        when 'Th'
                                            lineNext.lineType = 'Tu'
                                            line.line$.prop("class","Tu-#{lineNext.lineDepthAbs}")
                                            nextLineType = prevTxType
                                        when 'Tu'
                                            nextLineType = 'Lu'
                                        when 'To'
                                            nextLineType = 'Lo'
                                        when 'Lh'
                                            lineNext.lineType = nextLineType
                                            line.line$.prop("class","#{nextLineType}-#{lineNext.lineDepthAbs}")
                when 'Lh', 'Lu', 'Lo'
                    # TODO : if there are new siblings, the target type must be 
                    # the one of those, otherwise Tu is default.
                    lineNext = line.lineNext
                    lineTypeTarget = null
                    while lineNext != null and lineNext.lineDepthAbs >= line.lineDepthAbs
                        if lineNext.lineDepthAbs==line.lineDepthAbs + 1
                            lineTypeTarget = lineNext.lineType
                            lineNext=null
                        else
                            lineNext = lineNext.lineNext
                    if lineTypeTarget == null
                        linePrev = line.linePrev
                        while linePrev != null and linePrev.lineDepthAbs >= line.lineDepthAbs
                            if linePrev.lineDepthAbs==line.lineDepthAbs + 1
                                lineTypeTarget = linePrev.lineType
                                linePrev=null
                            else
                                linePrev = linePrev.linePrev
                    if lineTypeTarget == null
                        isTabAllowed       = true
                        lineTypeTarget     = 'Tu'
                        line.lineDepthAbs += 1
                        line.lineDepthRel += 1
                    else
                        if lineTypeTarget == 'Th'
                            isTabAllowed       = true
                            line.lineDepthAbs += 1
                            line.lineDepthRel  = 0
                        if lineTypeTarget == 'Tu' or  lineTypeTarget == 'To'
                            isTabAllowed       = true
                            line.lineDepthAbs += 1
                            line.lineDepthRel += 1
            if isTabAllowed
                line.line$.prop("class","#{lineTypeTarget}-#{line.lineDepthAbs}")
                line.lineType = lineTypeTarget
            if line.lineID == endLineID
                break
            else 
                line = line.lineNext


    ### ------------------------------------------------------------------------
    # shift + tab keypress
    #   e = event
    ###
    shiftTab : () ->
        # 1- Variables
        sel                = rangy.getIframeSelection(@editorIframe)
        range              = sel.getRangeAt(0)
        startDiv           = range.startContainer
        endDiv             = range.endContainer
        initialStartOffset = range.startOffset
        initialEndOffset   = range.endOffset
        # 2- find first and last div corresponding to the 1rst and
        #    last selected lines
        if startDiv.nodeName != "DIV"
            startDiv = $(startDiv).parents("div")[0]
        if endDiv.nodeName != "DIV"
            endDiv = $(endDiv).parents("div")[0]
        endLineID = endDiv.id
        # 3- loop on each line between the firts and last line selected
        # TODO : deal the case of a multi range (multi selections). 
        #        Currently only the first range is taken into account.
        line = @_lines[startDiv.id]
        loop
            switch line.lineType
                when 'Tu','Th'
                    # find previous sibling for the lineType.
                    previousSibling = line.linePrev
                    while previousSibling != null and previousSibling.lineDepthAbs >= line.lineDepthAbs
                        previousSibling = previousSibling.linePrev
                    if previousSibling != null
                        isTabAllowed   = true
                        lineTypeTarget = previousSibling.lineType
                        lineTypeTarget = "L" + lineTypeTarget.charAt(1)
                        line.lineDepthAbs -= 1
                        line.lineDepthRel -= previousSibling.lineDepthRel
                    else 
                        isTabAllowed=false
                when 'Lh'
                    isTabAllowed=true
                    lineTypeTarget     = 'Th'
                    #line.lineDepthAbs -= 1
                    #line.lineDepthRel  = 0
                when 'Lu'
                    isTabAllowed=true
                    lineTypeTarget     = 'Tu'
                    #line.lineDepthAbs-= 1
                    #line.lineDepthRel-= 1
                when 'Lo'
                    isTabAllowed=true
                    lineTypeTarget     = 'To'
                    #line.lineDepthAbs-= 1
                    #line.lineDepthRel-= 1
            if isTabAllowed
                line.line$.prop("class","#{lineTypeTarget}-#{line.lineDepthAbs}")
                line.lineType = lineTypeTarget
            if line.lineID == endDiv.id
                break
            else 
                line = line.lineNext


    ### ------------------------------------------------------------------------
    # return keypress
    #   e = event
    ###
    _return : ()->

        # 0- Range and selection properties
        [ sel, range, endLine, rangeIsEndLine, 
          startLine, rangeIsStartLine ] = @_findLines()
        
        # 1- Delete the selections so that the selection is collapsed
        # @_deleteMultiLinesSelections()
        
        # 2- Caret is at the end of the line
        if rangeIsEndLine
            newLine = @_insertLineAfter (
                sourceLineID       : startLine.lineID
                targetLineType     : startLine.lineType
                targetLineDepthAbs : startLine.lineDepthAbs
                targetLineDepthRel : startLine.lineDepthRel
            )
            # Position caret
            range4sel = rangy.createRange()
            range4sel.collapseToPoint(newLine.line$[0].firstChild,0)
            sel.setSingleRange(range4sel)

        # 3- Caret is at the beginning of the line
        else if rangeIsStartLine
            newLine = @_insertLineBefore (
                sourceLineID       : startLine.lineID
                targetLineType     : startLine.lineType
                targetLineDepthAbs : startLine.lineDepthAbs
                targetLineDepthRel : startLine.lineDepthRel
            )
            # Position caret
            range4sel = rangy.createRange()
            range4sel.collapseToPoint(startLine.line$[0].firstChild,0)
            sel.setSingleRange(range4sel)
        # 4- Caret is in the middle of the line
        else                     
            # Deletion of the end of the original line
            range.setEndBefore( startLine.line$[0].lastChild )
            endOfLineFragment = range.extractContents()
            range.deleteContents()
            # insertion
            newLine = @_insertLineAfter (
                sourceLineID       : startLine.lineID
                targetLineType     : startLine.lineType
                targetLineDepthAbs : startLine.lineDepthAbs
                targetLineDepthRel : startLine.lineDepthRel
                fragment           : endOfLineFragment
            )
            # Position caret
            range4sel = rangy.createRange()
            range4sel.collapseToPoint(newLine.line$[0].firstChild.childNodes[0],0)
            sel.setSingleRange(range4sel)

    ### ------------------------------------------------------------------------
    # turn in Th or Lh of the siblings of line (and line itself of course)
    # the children are note modified
    ### 
    _titilizeSiblings : (line) ->
        lineDepthAbs = line.lineDepthAbs
        # 1- transform all its next siblings in Th
        l = line
        while l!=null and l.lineDepthAbs >= lineDepthAbs
            if l.lineDepthAbs == lineDepthAbs
                switch l.lineType 
                    when 'Tu','To'
                        l.line$.prop("class","Th-#{lineDepthAbs}")
                        l.lineType = 'Th'
                        l.lineDepthRel = 0
                    when 'Lu','Lo'
                        l.line$.prop("class","Lh-#{lineDepthAbs}")
                        l.lineType = 'Lh'
                        l.lineDepthRel = 0
            l=l.lineNext
        # 2- transform all its previous siblings in Th
        l = line.linePrev 
        while l!=null and l.lineDepthAbs >= lineDepthAbs
            if l.lineDepthAbs == lineDepthAbs
                switch l.lineType
                    when 'Tu','To'
                        l.line$.prop("class","Th-#{lineDepthAbs}")
                        l.lineType = 'Th'
                        l.lineDepthRel = 0
                    when 'Lu','Lo'
                        l.line$.prop("class","Lh-#{lineDepthAbs}")
                        l.lineType = 'Lh'
                        l.lineDepthRel = 0
            l=l.linePrev
        return true


    ### ------------------------------------------------------------------------
    # find the sibling line of the parent of line that is the first of the list
    # ex :
    #   . Sibling1  <= _findParent1stSibling(line)
    #   . Sibling2
    #   . Parent
    #      . child1
    #      . line     : the line 
    # returns null if no previous sibling, the line otherwise
    # the sibling is a title (Th, Tu or To), not a line (Lh nor Lu nor Lo)
    ### 
    _findParent1stSibling : (line) ->
        lineDepthAbs = line.lineDepthAbs
        linePrev = line.linePrev
        if linePrev == null
            return line
        if lineDepthAbs <= 2
            # in the 2 first levels the answer is _firstLine
            while linePrev.linePrev != null
                linePrev = linePrev.linePrev
            return linePrev
        else
            while linePrev != null and linePrev.lineDepthAbs > (lineDepthAbs - 2)
                linePrev = linePrev.linePrev
            return linePrev.lineNext


    ### ------------------------------------------------------------------------
    # find the previous sibling line.
    # returns null if no previous sibling, the line otherwise
    # the sibling is a title (Th, Tu or To), not a line (Lh nor Lu nor Lo)
    ###
    _findPrevSibling : (line)->
        lineDepthAbs = line.lineDepthAbs
        linePrevSibling = line.linePrev
        if linePrevSibling == null
            # nothing to do if first line
            return null
        else if linePrevSibling.lineDepthAbs < lineDepthAbs
            # If AbsDepth of previous line is lower : we are on the first
            # line of a list of paragraphes, there is no previous sibling
            return null
        else
            while linePrevSibling.lineDepthAbs > lineDepthAbs
                linePrevSibling = linePrevSibling.linePrev
            while linePrevSibling.lineType[0] == 'L'
                linePrevSibling = linePrevSibling.linePrev
            return linePrevSibling


    ### ------------------------------------------------------------------------
    #   delete the user selection(s) 
    ###

    _deleteMultiLinesSelections : () ->

        # 0- prepare variables
        [ sel, range, endLine, rangeIsEndLine, 
          startLine, rangeIsStartLine ] = @_findLines()
        endLineDepthAbs = endLine.lineDepthAbs
        startLineDepthAbs = startLine.lineDepthAbs
        deltaDepth = endLineDepthAbs - startLineDepthAbs

        # 1- copy the end of endLine in a fragment
        range4fragment = rangy.createRangyRange()
        range4fragment.setStart(range.endContainer, range.endOffset)
        range4fragment.setEndAfter(endLine.line$[0].lastChild)
        endOfLineFragment = range4fragment.cloneContents()
        
        # 2- adapt the type of endLine and of its children to startLine
        # the only usefull case is when endLine must be changed from Th to Tu or To
        if endLine.lineType[1] == 'h' and startLine.lineType[1] != 'h'
            if endLine.lineType[0] == 'L'
                endLine.lineType = 'T' + endLine.lineType[1]
                endLine.line$.prop("class","#{endLine.lineType}-#{endLine.lineDepthAbs}")
            @markerList(endLine)

        # 3- delete lines
        range.deleteContents() 

        # 4- append fragment and delete endLine
        if startLine.line$[0].lastChild.nodeName == 'BR'
            startLine.line$[0].removeChild( startLine.line$[0].lastChild)
        startLine.line$.append( endOfLineFragment )
            # TODO : after append there is two span one after the other : if 
            # they have the same class then we should concatenate them.
        startLine.lineNext = endLine.lineNext
        endLine.lineNext.linePrev=startLine
        endLine.line$.remove()
        delete this._lines[endLine.lineID]

        # 5- adapt the class and depth of the children of end line
        if startLine.lineNext == null
            return 
         else
            line = startLine.lineNext
            # if the 1st line after deleted bloc is a Lx and its title was in
            # the block, then we turn the line in a Tx
            if line.lineType[0] == 'L' and line.lineDepthAbs>startLineDepthAbs
                line.lineType = 'T' + line.lineType[1]
                line.line$.prop("class","#{line.lineType}-#{line.lineDepthAbs}")
            # in case the depth delta between start and end deleted line is
            # greater than one, then the structure is not correct : we reduce
            # the depth of all the children of endLine. The new depth is limited
            # to endLine depth.
            deltaDepth1stLine = line.lineDepthAbs - startLineDepthAbs
            if deltaDepth1stLine > 1 # TODO or endLineType != line.lineType
                while line.lineDepthAbs > startLineDepthAbs
                    newDepth = Math.max( line.lineDepthAbs - deltaDepth , startLineDepthAbs)
                    line.lineDepthAbs = newDepth
                    line.line$.prop("class","#{line.lineType}-#{newDepth}")
                    # l.lineType = 'Lh'
                    # l.lineDepthRel = 0
                    line = line.lineNext
        
        # 6- position caret
        # TODO

    ### ------------------------------------------------------------------------
    # Insert a line after a source line
    # p = 
    #     sourceLineID       : ID of the line after which the line will be added
    #     fragment           : [optionnal] - an html fragment that will be added
    #     targetLineType     : type of the line to add
    #     targetLineDepthAbs : absolute depth of the line to add
    #     targetLineDepthRel : relative depth of the line to add
    ###
    _insertLineAfter : (p) ->
        @_highestId += 1
        lineID          = 'CNID_' + @_highestId
        newLine$        = $("<div id='#{lineID}' class='#{p.targetLineType}-#{p.targetLineDepthAbs}'></div>")
        if p.fragment? 
            newLine$.append( p.fragment )
            newLine$.append('<br>')
        else
            newLine$.append( $('<span></span><br>') )
        sourceLine = @_lines[p.sourceLineID]
        newLine$   = newLine$.insertAfter(sourceLine.line$)
        newLine    =  
            line$        : newLine$
            lineID       : lineID
            lineType     : p.targetLineType
            lineDepthAbs : p.targetLineDepthAbs
            lineDepthRel : p.targetLineDepthRel
            lineNext     : sourceLine.lineNext
            linePrev     : sourceLine
        @_lines[lineID] = newLine
        if sourceLine.lineNext != null
            sourceLine.lineNext.linePrev = newLine
        sourceLine.lineNext = newLine
        return newLine



    ### ------------------------------------------------------------------------
    # Insert a line before a source line
    # p = 
    #     sourceLineID       : ID of the line before which a line will be added
    #     fragment           : [optionnal] - an html fragment that will be added
    #     targetLineType     : type of the line to add
    #     targetLineDepthAbs : absolute depth of the line to add
    #     targetLineDepthRel : relative depth of the line to add
    ###
    _insertLineBefore : (p) ->
        @_highestId += 1
        lineID = 'CNID_' + @_highestId
        newLine$ = $("<div id='#{lineID}' class='#{p.targetLineType}-#{p.targetLineDepthAbs}'></div>")
        if p.fragment? 
            newLine$.append( p.fragment )
            newLine$.append( $('<br>') )
        else
            newLine$.append( $('<span></span><br>') )
        sourceLine = @_lines[p.sourceLineID]
        newLine$ = newLine$.insertBefore(sourceLine.line$)
        newLine = 
            line$        : newLine$
            lineID       : lineID
            lineType     : p.targetLineType
            lineDepthAbs : p.targetLineDepthAbs
            lineDepthRel : p.targetLineDepthRel
            lineNext     : sourceLine
            linePrev     : sourceLine.linePrev
        @_lines[lineID] = newLine
        if sourceLine.linePrev != null
            sourceLine.linePrev.lineNext = newLine
        sourceLine.linePrev=newLine
        return newLine


    ### ------------------------------------------------------------------------
    # Find first and last line of selection. 
    # Only the first range of the selections is taken into account.
    # returns : 
    #   sel : the selection
    #   range : the 1st range of the selections
    #   startLine : the 1st line of the range
    #   endLine : the last line of the range
    #   rangeIsEndLine : true if the range ends at the end of the last line
    #   rangeIsStartLine : turu if the range starts at the start of 1st line
    ###
    _findLines : () ->
        # 1- Variables
        sel                = rangy.getIframeSelection(@editorIframe)
        range              = sel.getRangeAt(0)
        startContainer     = range.startContainer
        endContainer       = range.endContainer
        initialStartOffset = range.startOffset
        initialEndOffset   = range.endOffset
        # 2- find endLine and the rangeIsEndLine
        # endContainer refers to a div of a line
        if endContainer.id? and endContainer.id.substr(0,5) == 'CNID_'  
            endLine = @_lines[ endContainer.id ]
            # rangeIsEndLine if endOffset points on the last node of the div or on 
            # the one before the last wich is a <br>
            rangeIsEndLine = ( endContainer.children.length-1==initialEndOffset ) or
                             (endContainer.children[initialEndOffset].nodeName=="BR")
        # means the range ends inside a div (span, textNode...)
        else   
            endLine = @_lines[ $(endContainer).parents("div")[0].id ]
            parentEndContainer = endContainer
            # rangeIsEndLine if the selection is at the end of the endContainer
            # and of each of its parents (this approach is more robust than just 
            # considering that the line is a flat succession of span : maybe one day 
            # there will be a table for instance...)
            rangeIsEndLine = false
            if parentEndContainer.nodeType == Node.TEXT_NODE
                rangeIsEndLine = ( initialEndOffset == parentEndContainer.textContent.length )
            else
                nextSibling = parentEndContainer.nextSibling
                rangeIsEndLine = (nextSibling == null or nextSibling.nodeName=='BR')
            parentEndContainer = endContainer.parentNode
            while rangeIsEndLine and parentEndContainer.nodeName != "DIV"
                nextSibling = parentEndContainer.nextSibling
                rangeIsEndLine = (nextSibling == null or nextSibling.nodeName=='BR')
                parentEndContainer = parentEndContainer.parentNode
        # 3- find startLine and rangeIsStartLine
        if startContainer.nodeName == 'DIV' # startContainer refers to a div of a line
            startLine = @_lines[ startContainer.id ]
            rangeIsStartLine = (initialStartOffset==0)
        else   # means the range starts inside a div (span, textNode...)
            startLine = @_lines[ $(startContainer).parents("div")[0].id ]
            rangeIsStartLine = (initialStartOffset==0)
            while rangeIsStartLine && parentEndContainer.nodeName != "DIV"
                rangeIsStartLine = (parentEndContainer.previousSibling==null)
                parentEndContainer = parentEndContainer.parentNode
        # 4- return
        return [sel, range, endLine, rangeIsEndLine, startLine, rangeIsStartLine]


    ###  -----------------------------------------------------------------------
    # Parse a raw html inserted in the iframe in order to update the controler
    ###
    _readHtml : () ->
        linesDiv$    = @editorBody$.children()  # linesDiv$= $[Div of lines]
        # loop on lines (div) to initialise the editor controler
        lineDepthAbs = 0
        lineDepthRel = 0
        lineID       = 0
        @_lines      = {}
        linePrev     = null
        lineNext     = null
        for htmlLine in linesDiv$
            htmlLine$ = $(htmlLine)
            lineClass = htmlLine$.attr('class') ? ""
            lineClass = lineClass.split('-')
            lineType  = lineClass[0]
            if lineType != ""
                lineDepthAbs_old = lineDepthAbs
                # hypothesis : _readHtml is called only on an html where 
                #              class="Tu-xx" where xx is the absolute depth
                lineDepthAbs     = +lineClass[1] 
                DeltaDepthAbs    = lineDepthAbs - lineDepthAbs_old
                lineDepthRel_old = lineDepthRel
                if lineType == "Th"
                    lineDepthRel = 0
                else 
                    lineDepthRel = lineDepthRel_old + DeltaDepthAbs
                lineID=(parseInt(lineID,10)+1)
                lineID_st = "CNID_"+lineID
                htmlLine$.prop("id",lineID_st)
                lineNew = 
                    line$        : htmlLine$
                    lineID       : lineID_st
                    lineType     : lineType
                    lineDepthAbs : lineDepthAbs
                    lineDepthRel : lineDepthRel
                    lineNext     : null
                    linePrev     : linePrev
                if linePrev != null then linePrev.lineNext = lineNew
                linePrev = lineNew
                @_lines[lineID_st] = lineNew
        @_highestId = lineID


    ### ------------------------------------------------------------------------
    # Verifies if the lines are well structured or not
    ###
    checkLines : () ->
        console.log 'Lines are being checked'
        #
        # We represent the lines architecture with a tree to be depth first
        # verified. The virtual root is at depth 0 and its sons are the titles
        # located at depth 1. Internal nodes = titles (Th, Tu, To)
        #                     Leaves         = lines  (Lh, Lu, Lo)
        # An internal node T-n can only have T-(n+1) or L-n children
        #
        # Todo: manage to treat the Th > Tu;To hierarchy
        #       a To(resp Tu, Th) can only have Lo(resp Lu, Lh) lines
        # 

        
        # We need to represent the DIVs with a tree
        # A virtual root for our tree (right before the first line)
        root =
            lineType: "root"
            lineNext: @_lines["CNID_1"]
            lineDepthAbs: 0

        # Array of nodes: the n-th element is the last depth-n ancestor met
        myAncestor = [root]

        # First element of the lines list
        currentLine = root

        # Defines what type of children a node can have
        # only useful for the structure's verification
        possibleSon = {
            "Th": (name) ->
                return name=="Lh" || name=="Th" || name=="To" || name=="Tu"
            "Tu": (name) ->
                return name=="Lu" || name=="To" || name=="Tu"
            "To": (name) ->
                return name=="Lu" || name=="To" || name=="Tu"
            "Lh": (name) ->
                return false
            "Lu": (name) ->
                return false
            "Lo": (name) ->
                return false
            "root": (name) ->
                return true
            }

        # Returns whether the DIV is a line or a title
        nodeType = (name) ->
            if name=="Lh" || name=="Lu" || name=="Lo"
                return "L"
            else if name=="Th" || name=="Tu" || name=="To"
                return "T"
            else
                return "ERR"

        # Builds a tree from the DIVs list by appending the property .sons
        # to every line that is a title (only if it's not empty)
        while currentLine.lineNext != null

            next  = currentLine.lineNext
            type  = nodeType(next.lineType)
            depth = next.lineDepthAbs
            if type == "T"
                # updates the ancestors
                if depth > myAncestor.length
                    myAncestor.push(next)
                else
                    myAncestor[depth] = next
                # adds title to the tree
                if ! myAncestor[depth-1].sons?
                    myAncestor[depth-1].sons = []
                myAncestor[depth-1].sons.push(next)
            else if type == "L"
                # adds line to the tree
                if ! myAncestor[depth].sons?
                    myAncestor[depth].sons = []
                myAncestor[depth].sons.push(next)
            # goes to the next node
            currentLine = next

        # Recursively checks the tree
        recVerif = (line) ->
            if line.sons?
                for i in [0..line.sons.length-1]
                    child = line.sons[i]
                    # Hierarchy verification
                    if ! possibleSon[line.lineType](child.lineType)
                        alert "struct #{child.lineType}-#{child.lineDepthAbs}"
                    # Depth verification
                    if nodeType(child.lineType) == "T"
                        if line.lineDepthAbs+1 != child.lineDepthAbs
                            alert "indent title #{child.lineType}-#{child.lineDepthAbs}"
                        recVerif(child)
                    else if nodeType(child.lineType) == "L"
                        if line.lineDepthAbs != child.lineDepthAbs
                            alert "indent line #{child.lineType}-#{child.lineDepthAbs}"

        recVerif(root)
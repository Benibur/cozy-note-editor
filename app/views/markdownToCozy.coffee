# Reads a string of html code given by (a slightly modified) showdown
# and turns it into our proper cozy html code.

class exports.CNmarkdownToCozy extends Backbone.View

    translate: (text) ->

        conv = new Showdown.converter()
        text = conv.makeHtml text
    
        # Writes the string into a jQuery object
        htmlCode = $(document.createElement 'ul').html text

        # final string
        cozyCode = ''
        
        # current line
        id = 0

        # Returns the corresponding fragment of cozy Code
        cozyTurn = (type, depth, p) ->
            # p is a (jquery) object that looks like this :
            # <p> some text <a>some link</a> again <img>some img</img> poof </p>
            # OR like this:  <li> some text <a>some link</a> ...
            # We are treating a line again, thus id must be increased
            id++
            code = ''
            p.contents().each () ->
                name = @nodeName
                if name == "#text"
                    code += "<span>#{$(@).text()}</span>"
                else if @tagName?
                    $(@).wrap('<div></div>')
                    code += "#{$(@).parent().html()}"
                    $(@).unwrap()
            return "<div id=CNID_#{id} class=#{type}-#{depth}>" + code +
                "<br></div>"
                
        # current depth
        depth = 0
        
        # Reads recursively through the lines
        recRead = (obj, status) ->
            tag = obj[0].tagName
            if tag == "UL"
                depth++
                obj.children().each () ->
                    recRead($(@), "u")
                depth--
            else if tag == "OL"
                depth++
                obj.children().each () ->
                    recRead($(@), "o")
                depth--
            else if tag == "LI" && obj.contents().get(0)?
            
                # cas du <li>Un seul titre sans lignes en-dessous</li>
                if obj.contents().get(0).nodeName == "#text"
                    obj = obj.clone().wrap('<p></p>').parent()
                for i in [0..obj.children().length-1]
                    child = $ obj.children().get i
                    if i == 0
                        if child.attr("class") == "TH"
                            cozyCode += cozyTurn("Th", depth, child)
                        else
                            cozyCode += cozyTurn("T#{status}", depth, child)
                    else
                        if child.attr("class") == "TH"
                            recRead(child, "h")
                        else
                            recRead(child, status)
                        
            else if tag == "P"
                cozyCode += cozyTurn("L#{status}", depth, obj)


        htmlCode.children().each () ->
            recRead($(@), "u")
        
        return cozyCode

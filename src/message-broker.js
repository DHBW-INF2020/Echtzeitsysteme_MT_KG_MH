const messageField = document.getElementById('message-collector-field')

function addNewMessage(message_type, message_content, alert_color)
{
    let content = String(message_type) + ': ' + String(message_content);
    let paragraph = document.createElement("p");
    let node = document.createTextNode(content);    

    paragraph.appendChild(node);

    if(alert_color == "g")
    {
        paragraph.setAttribute("style", "background-color: rgb(130, 253, 138); padding: 5px; border-radius: 5px;")

    }
    else if(alert_color == "y")
    {
        paragraph.setAttribute("style", "background-color: rgb(239, 248, 142); padding: 5px; border-radius: 5px;")

    }
    else if(alert_color == "r")
    {
        paragraph.setAttribute("style", "background-color: rgb(248, 142, 142); padding: 5px; border-radius: 5px;")

    }
    else
    {
        paragraph.setAttribute("style", "padding: 5px; border-radius: 5px;")
 
    }
    messageField.appendChild(paragraph);
}
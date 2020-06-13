import React, {useState} from 'react'

// { 'Human Torch': ['hero', 'mutant', 'tough', 'dumb', 'tall'], \
// 'Spiderman': ['hero', 'tough', 'smart', 'tall'], 'Kyle': ['human', 'weak', 'smart', 'short'], 
// 'JonJon': ['human', 'strong', 'smart', 'tall', 'weird'] }

export default function SendTags () {
    const [recipients, updateRecipients] = useState("")
    const [tags, updateTags] = useState("")
    const [config, updateConfig] = useState("")
    const [sendTo, updateSendTo] = useState("")
    const [sendType, updateSendType] = useState("")
    const [sent, updateSent] = useState(false)

    const handleChange = (event) => {
        const value = event.target.value
        switch(event.target.name) {
            case "tags":
                let formattedTags = value.split(',').map( (t) =>  t.trim() )
                updateTags(formattedTags)
                return
            case "config":
                try{
                    let reformedVal = value.replace(/“/g, '"')
                                            .replace(/”/g, '"')
                                            .replace(/'/g, '"');
                    let jsonVal = JSON.parse(reformedVal);
                    updateConfig(jsonVal)
                    return
                } catch (e) {
                    console.error(e);
                    console.error("Invalid JSON");
                    updateConfig({})
                    return
                }
            case "sendTo":
                let formattedSendTos = value.split(',').map( (t) =>  t.trim() )
                updateSendTo(formattedSendTos)
                return
            case "sendType":
                if (value.toLowerCase() != "and" && value.toLowerCase() != "or") {
                    console.error("Defaulting to AND");
                    updateSendType("AND");
                    return;
                } else {
                    updateSendType(value.toUpperCase())
                    return
                }
            default:
                return;
        }
    }

    const handleSubmit = (event) => {
        event.preventDefault()
        console.log(tags);
        console.log(config);
        console.log(sendTo);
        console.log(sendType);

        let sendList = [];
        let sendToCount = sendTo.length - 1;

        const peopleKeys = Object.keys(config);
        peopleKeys.forEach( (key, index) => { // Iterate over possible recipients
            let person = config[key];
            for (var i = 0; i < tags.length; i++) { // Iterate over possible tags
                let foundCount = 0;
                let tag = tags[i]
                if (sendType === "OR") {
                    if (person.includes(tag) && sendTo.includes(tag) ) {
                        sendList.push(key);
                        break;
                    }
                }
                else if (sendType === "AND") {
                    if (person.includes(tag) && sendTo.includes(tag) ) {
                        foundCount++
                    }
                    if (foundCount >= sendToCount) {
                        sendList.push(key);
                        break;
                    }
                }
            }
        })
        updateRecipients(sendList.join(", "));
        updateSent(true);
        console.log("Send List", sendList)

    }

    return (
        <div>
            <form onSubmit={handleSubmit} style={{textAlign: "left"}}>
                <label style={{paddingRight: "10px"}}>
                    <div>
                        <span style={{paddingRight: "10px"}}>Tags (separated by commas):</span>
                        <input type="text" name="tags" onChange={handleChange}/>
                    </div>
                    <div>
                        <span style={{paddingRight: "10px", paddingTop: "20px"}} 
                              dangerouslySetInnerHTML={{__html: "People Configs (e.g. {'Spiderman': ['hero', 'tough', 'smart”, 'tall']})"}}>
                        </span>
                        <input type="text" name="config" style={{width: '500px'}} onChange={handleChange}/>
                    </div>
                    <div>
                        <span style={{paddingRight: "10px", paddingTop: "20px"}}>Send To:</span>
                        <input type="text" name="sendTo" onChange={handleChange}/>
                    </div>
                    <div>
                        <span style={{paddingRight: "10px", paddingTop: "20px"}}>AND/OR?: </span>
                        <input type="text" name="sendType" onChange={handleChange}/>
                    </div>
                </label>
                <input type="submit" value="Send Messages" />
            </form>
            { sent && <div>Sent to: {recipients}</div> }
        </div>
    )
}
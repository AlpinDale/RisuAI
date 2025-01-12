import { translatorPlugin } from "../process/plugins"

let cache={
    origin: [''],
    trans: ['']
}

let waitTrans = 0

export async function translate(text:string, reverse:boolean) {
    const plug = await translatorPlugin(text, reverse ? 'ko' : 'en', reverse ? 'en' : 'ko')
    if(plug){
        return plug.content
    }
    if(!reverse){
        const ind = cache.origin.indexOf(text)
        if(ind !== -1){
            return cache.trans[ind]
        }
    }
    else{
        const ind = cache.trans.indexOf(text)
        if(ind !== -1){
            return cache.origin[ind]
        }
    }

    return googleTrans(text, reverse)
}

async function googleTrans(text:string, reverse:boolean) {

    const arg = {

        from: reverse ? 'ko' : 'en',

        to: reverse ? 'en' : 'ko',

        host: 'translate.googleapis.com',

    }



    const url = `https://${arg.host}/translate_a/single?client=gtx&dt=t&sl=${arg.from}&tl=${arg.to}&q=` + encodeURIComponent(text)



    const f = await fetch(url, {

        method: "GET",

    })

    const res = await f.json()

    

    if(typeof(res) === 'string'){

        return res as unknown as string

    }

    const result = res[0].map((s) => s[0]).filter(Boolean).join('');

    cache.origin.push(reverse ? result : text)

    cache.trans.push(reverse ? text : result)

    return result

}
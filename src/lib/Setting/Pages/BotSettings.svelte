<script lang="ts">
    import Check from "src/lib/Others/Check.svelte";
    import { language } from "src/lang";
    import Help from "src/lib/Others/Help.svelte";
    import { DataBase } from "src/ts/database";
    import { customProviderStore, getCurrentPluginMax } from "src/ts/process/plugins";
    import { isTauri } from "src/ts/globalApi";
    import { tokenize } from "src/ts/tokenizer";
    import DropList from "src/lib/SideBars/DropList.svelte";
    import { PlusIcon, TrashIcon } from "lucide-svelte";
    let tokens = {
        mainPrompt: 0,
        jailbreak: 0,
        globalNote: 0
    }

    let lasttokens = {
        mainPrompt: '',
        jailbreak: '',
        globalNote: ''
    }
    export let openPresetList =false

    async function loadTokenize(){
        if(lasttokens.mainPrompt !== $DataBase.mainPrompt){
            lasttokens.mainPrompt = $DataBase.mainPrompt
            tokens.mainPrompt = await tokenize($DataBase.mainPrompt)
        }
        tokens.mainPrompt = await tokenize($DataBase.mainPrompt)
        tokens.jailbreak = await tokenize($DataBase.jailbreak)
        tokens.globalNote = await tokenize($DataBase.globalNote)
    }
    
    $: loadTokenize()
</script>

<h2 class="mb-2 text-2xl font-bold mt-2">{language.chatBot}</h2>
<span class="text-neutral-200 mt-4">{language.model} <Help key="model"/></span>
<select class="bg-transparent input-text mt-2 mb-2 text-gray-200 appearance-none text-sm" bind:value={$DataBase.aiModel}>
    <option value="gpt35" class="bg-darkbg appearance-none">OpenAI GPT-3.5</option>
    <option value="gpt4" class="bg-darkbg appearance-none">OpenAI GPT-4</option>
    <option value="textgen_webui" class="bg-darkbg appearance-none">Text Generation WebUI</option>
    <option value="palm2" class="bg-darkbg appearance-none">Google Palm2</option>
    {#if $DataBase.plugins.length > 0}
        <option value="custom" class="bg-darkbg appearance-none">Plugin</option>
    {/if}
</select>

<span class="text-neutral-200 mt-2">{language.submodel} <Help key="submodel"/></span>
<select class="bg-transparent input-text mt-2 mb-4 text-gray-200 appearance-none text-sm" bind:value={$DataBase.subModel}>
    <option value="gpt35" class="bg-darkbg appearance-none">OpenAI GPT-3.5</option>
    <option value="gpt4" class="bg-darkbg appearance-none">OpenAI GPT-4</option>
    <option value="palm2" class="bg-darkbg appearance-none">Google Palm2</option>
    <option value="textgen_webui" class="bg-darkbg appearance-none">Text Generation WebUI</option>
    {#if $customProviderStore.length > 0}
        <option value="custom" class="bg-darkbg appearance-none">Plugin</option>
    {/if}
</select>

{#if $DataBase.aiModel === 'palm2' || $DataBase.subModel === 'palm2'}
    <span class="text-neutral-200">Palm2 {language.apiKey}</span>
    <input class="text-neutral-200 mb-4 p-2 bg-transparent input-text focus:bg-selected text-sm" placeholder="..." bind:value={$DataBase.palmAPI}>
{/if}
{#if $DataBase.aiModel === 'gpt35' || $DataBase.aiModel === 'gpt4' || $DataBase.subModel === 'gpt4' || $DataBase.subModel === 'gpt35'}
    <span class="text-neutral-200">OpenAI {language.apiKey} <Help key="oaiapikey"/></span>
    <input class="text-neutral-200 p-2 bg-transparent input-text focus:bg-selected text-sm" placeholder="sk-XXXXXXXXXXXXXXXXXXXX" bind:value={$DataBase.openAIKey}>
    <div class="flex items-center mt-2 mb-4">
        <Check bind:check={$DataBase.useStreaming}/>
        <span>OpenAI {language.streaming}</span>
    </div>
{/if}
{#if $DataBase.aiModel === 'custom'}
    <span class="text-neutral-200 mt-2">{language.plugin}</span>
    <select class="bg-transparent input-text mt-2 mb-4 text-gray-200 appearance-none text-sm" bind:value={$DataBase.currentPluginProvider}>
        <option value="" class="bg-darkbg appearance-none">None</option>
        {#each $customProviderStore as plugin}
            <option value={plugin} class="bg-darkbg appearance-none">{plugin}</option>
        {/each}
    </select>
{/if}
{#if $DataBase.aiModel === 'textgen_webui' || $DataBase.subModel === 'textgen_webui'}
    <span class="text-neutral-200">TextGen {language.providerURL} <Help key="oogaboogaURL"/></span>
    <input class="text-neutral-200 mb-4 p-2 bg-transparent input-text focus:bg-selected" placeholder="https://..." bind:value={$DataBase.textgenWebUIURL}>
    <span class="text-draculared text-xs mb-2">You must use WebUI without agpl license or use unmodified version with agpl license to observe the contents of the agpl license.</span>
    <span class="text-draculared text-xs mb-2">You must use textgen webui with --no-stream and without --cai-chat or --chat</span>
    {#if !isTauri}
        <span class="text-draculared text-xs mb-2">You are using web version. you must use ngrok or other tunnels to use your local webui.</span>
    {/if}
{/if}
<span class="text-neutral-200">{language.mainPrompt} <Help key="mainprompt"/></span>
<textarea class="bg-transparent input-text mt-2 mb-2 text-gray-200 resize-none h-20 min-h-20 focus:bg-selected text-xs w-full" autocomplete="off" bind:value={$DataBase.mainPrompt}></textarea>
<span class="text-gray-400 mb-6 text-sm">{tokens.mainPrompt} {language.tokens}</span>
<span class="text-neutral-200">{language.jailbreakPrompt} <Help key="jailbreak"/></span>
<textarea class="bg-transparent input-text mt-2 mb-2 text-gray-200 resize-none h-20 min-h-20 focus:bg-selected text-xs w-full" autocomplete="off" bind:value={$DataBase.jailbreak}></textarea>
<span class="text-gray-400 mb-6 text-sm">{tokens.jailbreak} {language.tokens}</span>
<span class="text-neutral-200">{language.globalNote} <Help key="globalNote"/></span>
<textarea class="bg-transparent input-text mt-2 mb-2 text-gray-200 resize-none h-20 min-h-20 focus:bg-selected text-xs w-full" autocomplete="off" bind:value={$DataBase.globalNote}></textarea>

<span class="text-gray-400 mb-6 text-sm">{tokens.globalNote} {language.tokens}</span>
<span class="text-neutral-200">{language.maxContextSize}</span>
{#if $DataBase.aiModel === 'gpt35'}
    <input class="text-neutral-200 mb-4 text-sm p-2 bg-transparent input-text focus:bg-selected" type="number" min={0} max="4000" bind:value={$DataBase.maxContext}>
{:else if $DataBase.aiModel === 'gpt4' || $DataBase.aiModel === 'textgen_webui'}
    <input class="text-neutral-200 mb-4 text-sm p-2 bg-transparent input-text focus:bg-selected" type="number" min={0} max="8000" bind:value={$DataBase.maxContext}>
{:else if $DataBase.aiModel === 'custom'}
    <input class="text-neutral-200 mb-4 text-sm p-2 bg-transparent input-text focus:bg-selected" type="number" min={0} max={getCurrentPluginMax($DataBase.currentPluginProvider)} bind:value={$DataBase.maxContext}>
{/if}
<span class="text-neutral-200">{language.maxResponseSize}</span>
<input class="text-neutral-200 mb-4 p-2 bg-transparent input-text focus:bg-selected text-sm" type="number" min={0} max="2048" bind:value={$DataBase.maxResponse}>
<span class="text-neutral-200">{language.temperature} <Help key="tempature"/></span>
<input class="text-neutral-200 p-2 bg-transparent input-text focus:bg-selected" type="range" min="0" max="200" bind:value={$DataBase.temperature}>
<span class="text-gray-400 mb-6 text-sm">{($DataBase.temperature / 100).toFixed(2)}</span>
<span class="text-neutral-200">{language.frequencyPenalty} <Help key="frequencyPenalty"/></span>
<input class="text-neutral-200 p-2 bg-transparent input-text focus:bg-selected" type="range" min="0" max="100" bind:value={$DataBase.frequencyPenalty}>
<span class="text-gray-400 mb-6 text-sm">{($DataBase.frequencyPenalty / 100).toFixed(2)}</span>
<span class="text-neutral-200">{language.presensePenalty} <Help key="presensePenalty"/></span>
<input class="text-neutral-200 p-2 bg-transparent input-text focus:bg-selected" type="range" min="0" max="100" bind:value={$DataBase.PresensePenalty}>
<span class="text-gray-400 mb-6 text-sm">{($DataBase.PresensePenalty / 100).toFixed(2)}</span>

<span class="text-neutral-200 mt-2">{language.forceReplaceUrl} <Help key="forceUrl"/></span>
<input class="text-neutral-200 p-2 bg-transparent input-text focus:bg-selected text-sm"bind:value={$DataBase.forceReplaceUrl} placeholder="Leave blank to not replace url">
<span class="text-neutral-200 mt-2">{language.submodel} {language.forceReplaceUrl} <Help key="forceUrl"/></span>
<input class="text-neutral-200 p-2 bg-transparent input-text focus:bg-selected text-sm"bind:value={$DataBase.forceReplaceUrl2} placeholder="Leave blank to not replace url">



<details class="mt-4">
    <summary class="mb-2">{language.advancedSettings}</summary>
    <span class="text-neutral-200 mb-2 mt-4">{language.formatingOrder} <Help key="formatOrder"/></span>
    <DropList bind:list={$DataBase.formatingOrder} />
    <span class="text-neutral-200 mt-2">Bias <Help key="bias"/></span>
    <table class="contain w-full max-w-full tabler mt-2">
        <tr>
            <th class="font-medium w-1/2">Bias</th>
            <th class="font-medium w-1/3">{language.value}</th>
            <th class="font-medium cursor-pointer hover:text-green-500" on:click={() => {
                    let bia = $DataBase.bias
                    bia.push(['', 0])
                    $DataBase.bias = bia
            }}><PlusIcon /></th>
        </tr>
        {#if $DataBase.bias.length === 0}
            <tr>
                <div class="text-gray-500">{language.noBias}</div>
            </tr>
        {/if}
        {#each $DataBase.bias as bias, i}
            <tr>
                <td class="font-medium truncate w-1/2">
                    <input class="text-neutral-200 mt-2 mb-4 p-2 bg-transparent input-text focus:bg-selected" bind:value={$DataBase.bias[i][0]} placeholder="string">
                </td>
                <td class="font-medium truncate w-1/3">
                    <input class="text-neutral-200 mt-2 mb-4 w-full p-2 bg-transparent input-text focus:bg-selected" bind:value={$DataBase.bias[i][1]} type="number" max="100" min="-100">
                </td>
                <button class="font-medium flex justify-center items-center h-full cursor-pointer hover:text-green-500" on:click={() => {
                    let bia = $DataBase.bias
                    bia.splice(i, 1)
                    $DataBase.bias = bia
                }}><TrashIcon /></button>
            </tr>
        {/each}
    </table>

    <div class="flex items-center mt-4">
        <Check bind:check={$DataBase.promptPreprocess}/>
        <span>{language.promptPreprocess}</span>
    </div>
</details>

<button on:click={() => {openPresetList = true}} class="mt-4 drop-shadow-lg p-3 border-borderc border-solid flex justify-center items-center ml-2 mr-2 border-1 hover:bg-selected">{language.presets}</button>


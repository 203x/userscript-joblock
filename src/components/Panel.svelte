<script>
  import { createEventDispatcher } from 'svelte'
  import { onMount } from 'svelte'
  import { blacklist, whitelist, lowlist, salary } from '../stores.js'
  let index = 0
  let arr = ['年薪配置', '低关注名单', '黑名单', '白名单']

  let list = {
    blacklist: '',
    whitelist: '',
    lowlist: '',
  }

  let new_salary = {
    enable: false,
    lower: 0,
    upper: 0,
  }

  let tip = ''

  function arr2str(arr) {
    return arr.join('\n')
  }

  function str2arr(str) {
    return str.trim().split('\n')
  }

  onMount(() => {
    list.blacklist = arr2str($blacklist)
    list.whitelist = arr2str($whitelist)
    list.lowlist = arr2str($lowlist)
    new_salary = $salary
  })

  const dispatch = createEventDispatcher()

  function save() {
    try {
      blacklist.set(str2arr(list.blacklist))
      whitelist.set(str2arr(list.whitelist))
      lowlist.set(str2arr(list.lowlist))
      salary.set(new_salary)
      tip = '已保存'
      dispatch('save', {})
    } catch (error) {
      tip = error
    }
    setTimeout(() => {
      tip = ''
    }, 3000)
  }

  function close() {
    dispatch('close', {})
  }
</script>

<style>
  label {
    display: block;
    margin-bottom: 10px;
  }
</style>

<div class="x-panel">

  <ul class="tab-nav">
    {#each arr as item, i}
      <li
        class="tab-nav-li {i === index ? 'activa' : ''}"
        on:click={() => {
          index = i
        }}>
        {item}
      </li>
    {/each}
  </ul>
  <div class="x-body">
    {#if index === 0}
      <label>
        <input type="checkbox" bind:checked={new_salary.enable} />
        启用年薪过滤
      </label>
      <label title="最高年薪高于本值">
        年薪阙值（上限）
        <input type="number" bind:value={new_salary.upper} min="0" max="1000" />
      </label>
      <label title="最低年薪高于本值">
        年薪阙值（下限）
        <input type="number" bind:value={new_salary.lower} min="0" max="1000" />
      </label>
    {:else if index === 1}
      <textarea bind:value={list.lowlist} placeholder="" />
    {:else if index === 2}
      <textarea bind:value={list.blacklist} placeholder="" />
    {:else if index === 3}
      <textarea bind:value={list.whitelist} placeholder="" />
    {/if}
  </div>
  <div class="x-footer">
    <span class="x-btn" on:click={save}>保存并应用</span>
    <span class="x-btn" on:click={close}>关闭</span>
    <span class="x-tip">{tip}</span>
  </div>
</div>

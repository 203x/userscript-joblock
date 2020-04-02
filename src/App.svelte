<script>
  import Joblock from './joblock'
  import Icon from './components/Icon.svelte'
  import Panel from './components/Panel.svelte'
  import { blacklist, whitelist, lowlist, salary } from './stores.js'
  import { onMount } from 'svelte'

  let visible = false

  let joblock = null

  let statis = {
    black: 0,
    white: 0,
    low: 0,
    cheap: 0,
    total: 0
  }

  function isSalary(job) {
    if ($salary.enable === false || !job.salary) {
      return false
    }
    return !(
      job.salary.upper > $salary.upper || job.salary.lower > $salary.lower
    )
  }

  function isWhite(job) {
    return whitelist.in(job.company)
  }

  function isBlack(job) {
    return blacklist.in(job.company)
  }

  function isLow(job) {
    return lowlist.in(job.company)
  }

  onMount(() => {
    joblock = new Joblock(
      jobs => {
        statis = {
          black: 0,
          white: 0,
          low: 0,
          cheap: 0,
          total: jobs.length
        }
        jobs.forEach(job => {
          let level = 0
          if (isSalary(job)) {
            statis.cheap += 1
            level = 9
          } else if (isLow(job)) {
            statis.low += 1
            level = 1
          } else if (isWhite(job)) {
            statis.white += 1
          } else if (isBlack(job)) {
            statis.black += 1
            level = 8
          }
          job.level = level
        })

        // GM_log(total)
      },
      (type, company) => {
        const list = type === 'low' ? lowlist : blacklist
        if (list.in(company)) {
          list.del(company)
        } else {
          list.add(company)
        }
      }
    )
    GM_registerMenuCommand('Config', ()=>{
      visible = !visible
    })
  })

  function onSave() {
    joblock.refresh()
  }
</script>

<div>
  <span
    class="x-btn-icon"
    on:click={() => {
      visible = !visible
    }}>
    <Icon type="star" />
  </span>
  <!-- {total.low} - {total.black} - {total.cheap} -->
</div>

{#if visible === true}
  <Panel
    {statis}
    on:save={onSave}
    on:close={() => {
      visible = false
    }} />
{/if}

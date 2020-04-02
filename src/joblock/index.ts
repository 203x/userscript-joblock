import Job from './Job'
import Config from '../rules/config.yaml'
import { Rule } from '../rules/types'

interface Rules {
  [key: string]: Rule
}

function isFunction(obj: any): boolean {
  return Object.prototype.toString.call(obj) === '[object Function]'
}

function reg(str: string): RegExpExecArray {
  const pathname = window.location.pathname
  const r = new RegExp(str)
  return r.exec(pathname)
}

const rules: Rules = Config.rules

class Joblock {
  rule: Rule
  jobs: Job[]
  onRefresh: (jobs?: Job[]) => void
  onChange: (type: 'low' | 'black', company: string) => void

  private timed: ReturnType<typeof setTimeout>

  constructor(
    onRefresh?: (jobs?: Job[]) => void,
    onChange?: (type: 'low' | 'black', company: string) => void
  ) {
    this.rule = rules[window.location.host]
    this.onRefresh = onRefresh
    this.onChange = onChange
    this.install()
    this.refresh()
  }

  private install(): void {
    if (this.rule && this.rule.onRefresh) {
      const onRefreshEl = document.querySelectorAll(this.rule.onRefresh)[0]
      if (onRefreshEl) {
        onRefreshEl.addEventListener('click', () => {
          this.timeRefresh()
        })
      }
      window.addEventListener('scroll', () => {
        this.timeRefresh()
      })
    }
  }

  timeRefresh(): void {
    if (!this.timed) {
      this.timed = setTimeout(() => {
        this.refresh()
        this.timed = null
      }, 500)
    }
  }

  getJobs(): Job[] {
    try {
      return this.rule && reg(this.rule.pathname)
        ? Array.from(document.querySelectorAll(this.rule.ItemList)).map(
            (el) => {
              if (this.jobs) {
                for (const iterator of this.jobs) {
                  if (iterator.el === el) {
                    return iterator
                  }
                }
              }
              return new Job(
                el,
                this.rule,
                (type: 'low' | 'black', company: string) => {
                  if (isFunction(this.onChange)) {
                    this.onChange(type, company)
                  }
                  this.refresh()
                }
              )
            }
          )
        : []
    } catch (error) {
      return []
    }
  }

  refresh(): void {
    this.jobs = this.getJobs()
    if (isFunction(this.onRefresh)) {
      this.onRefresh(this.jobs)
    }
  }
}

export default Joblock

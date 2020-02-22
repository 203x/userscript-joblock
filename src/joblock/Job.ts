import btnHtml from './btn.html'
import { Rule } from '../rules/types'

const levelAttr = 'data-level'

export function parseHTML(string: string): HTMLCollection {
  const context = document.implementation.createHTMLDocument()

  const base = context.createElement('base')
  base.href = document.location.href
  context.head.appendChild(base)

  context.body.innerHTML = string
  return context.body.children
}

class Job {
  el: Element
  rule: Rule
  company: string
  salary: {
    lower: number
    upper: number
  }
  onClick: (type: 'low' | 'black',company: string) => void

  constructor(
    el: Element,
    rule: Rule,
    onClick: (type: 'low' | 'black', company: string) => void
  ) {
    this.el = el
    this.rule = rule
    this.onClick = onClick
    this.company = this.el
      .querySelectorAll(this.rule.ItemCompany)[0]
      .textContent.trim()
    this.salary = this.getSalary()
    this.initBtn()
  }

  getSalary(): {
    lower: number
    upper: number
  } {
    const SalaryEl = this.el.querySelectorAll(this.rule.ItemSalarySelector)[0]
    if (SalaryEl) {
      const r = new RegExp(this.rule.ItemSalaryReg)
      const g = r.exec(SalaryEl.textContent)
      if (g && g[0] && g[1] && g[2]) {
        const salary = {
          lower: parseInt(g[1]),
          upper: parseInt(g[2]),
          multiple: g[3] ? parseInt(g[3]) : 12,
        }
        const value = {
          lower: (salary.lower * salary.multiple) / 10,
          upper: (salary.upper * salary.multiple) / 10,
        }
        SalaryEl.textContent = `${SalaryEl.textContent} [${value.lower}-${value.upper}]`
        return value
      }
    }
    return null
  }

  set level(lv: number) {
    if (lv === 0) {
      this.el.removeAttribute(levelAttr)
    } else {
      this.el.setAttribute(levelAttr, lv.toString())
    }
  }

  get level(): number{
    const lv = this.el.getAttribute(levelAttr)
    if (lv) {
      return parseInt(lv)
    }else {
      return 0
    }
  }

  initBtn(): void {
    const html = parseHTML(btnHtml)
    const btnBlacklist = html[0]
    const btnLowlist = html[1]
    btnBlacklist.setAttribute('style', this.rule.BlockBtnStyle)
    btnLowlist.setAttribute('style', this.rule.BlockBtnStyle)
    
    const btnWrap = this.el.querySelectorAll(this.rule.ItemAddBtn)[0]
    if (btnWrap) {
      btnWrap.append(btnBlacklist)
      btnWrap.append(btnLowlist)
      btnBlacklist.addEventListener('click', e => {
        e.preventDefault()
        this.onClick('black',this.company)
      })
      btnLowlist.addEventListener('click', e => {
        e.preventDefault()
        this.onClick('low', this.company)
      })
    }else{
      // console.log(this.el, this.rule.ItemAddBtn, this.el.querySelectorAll(this.rule.ItemAddBtn));
      GM_log('Joblock找不到：' + this.rule.ItemAddBtn)
    }
  }
}

export default Job

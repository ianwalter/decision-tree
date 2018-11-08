const BaseError = require('@ianwalter/base-error')

export default class {
  constructor (tree = {}) {
    this.currentNode = tree
    this.path = tree.key ? [tree.key] : []
    this.state = {}

    this.noChildren = `No children found to move to`
    this.noLead = `Can't determine which child to move to`
    this.noParent = `No parent node found to move to`
  }

  set (key, value) {
    this.state[key] = value
  }

  moveTo (node) {
    if (node.key !== this.currentNode.key) {
      this.parentNode = this.currentNode
      this.path.push(node.key)
    } else {
      this.path.pop()
    }
    this.currentNode = node
    return node
  }

  next () {
    const selectedOptionKey = this.state[this.currentNode.key]
    const selectedOption = this.currentNode.options
      ? this.currentNode.options.find(o => o.key === selectedOptionKey)
      : null
    if (this.currentNode.children.length < 1) {
      throw new BaseError(this.noChildren, this.currentNode)
    } else if (this.currentNode.children.length === 1) {
      return this.moveTo(this.currentNode.children[0])
    } else if (selectedOption && selectedOption.leadsTo) {
      const key = typeof selectedOption.leadsTo === 'function'
        ? selectedOption.leadsTo(this)
        : selectedOption.leadsTo
      const node = this.currentNode.children.find(node => node.key === key)
      if (node) {
        return this.moveTo(node)
      }
    }
    throw new BaseError(this.noLead, selectedOption, this.currentNode.children)
  }

  prev () {
    if (this.parentNode) {
      return this.moveTo(this.parentNode)
    }
    throw new BaseError(this.noParent)
  }
}

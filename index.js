import BaseError from '@ianwalter/base-error'

export default class {
  constructor (tree = {}, path = [tree], state = {}) {
    this.path = path
    this.state = state

    this.noChildren = `No children found to move to`
    this.noLead = `Can't determine which child to move to`
    this.noParent = `No parent node found to move to`
  }

  set (key, value) {
    if (typeof key === 'object' && value === undefined) {
      this.state = key
    } else {
      this.state[key] = value
    }
    return this
  }

  current () {
    return this.path[this.path.length - 1]
  }

  next () {
    const currentNode = this.current()
    const selectedOptionKey = this.state[currentNode.key]
    const selectedOption = currentNode.options
      ? currentNode.options.find(o => o.key === selectedOptionKey)
      : null
    if (currentNode.children.length < 1) {
      throw new BaseError(this.noChildren, currentNode)
    } else if (currentNode.children.length === 1) {
      return this.path.push(currentNode.children[0]) && currentNode.children[0]
    } else if (selectedOption && selectedOption.leadsTo) {
      const key = typeof selectedOption.leadsTo === 'function'
        ? selectedOption.leadsTo(this)
        : selectedOption.leadsTo
      const node = currentNode.children.find(node => node.key === key)
      if (node) {
        return this.path.push(node) && node
      }
    }
    throw new BaseError(this.noLead, selectedOptionKey, selectedOption)
  }

  prev () {
    const parentNode = this.path[this.path.length - 2]
    if (parentNode) {
      return this.path.pop()
    }
    throw new BaseError(this.noParent)
  }

  pathKeys () {
    return this.path.map(({ key }) => key)
  }
}

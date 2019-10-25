import BaseError from '@ianwalter/base-error'

const findItemByKey = (items = [], key) => items.find(item => item.key === key)

class NoChildrenError extends BaseError {
  constructor (node) {
    super('No children found to move to', { node })
  }
}

class NoLeadToError extends BaseError {
  constructor (key, option) {
    super('Cannot determine which child to move to', { key, option })
  }
}

class NoParentError extends BaseError {
  constructor () {
    super('No parent node found to move to')
  }
}

class DecisionTree {
  constructor (tree = {}, path = [tree], state = {}) {
    this.path = path
    this.state = state
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

  goToNode (node) {
    return node ? this.path.push(node) && node : node
  }

  getNodeFromLeadsTo (currentNode, { leadsTo }) {
    const key = typeof leadsTo === 'function' ? leadsTo(this) : leadsTo
    return findItemByKey(currentNode.children, key)
  }

  next () {
    const currentNode = this.current()

    // Get the selected option key from state or extract it from an array if
    // multiple options can be selected.
    let selectedOptionKey = this.state[currentNode.key]
    if (Array.isArray(selectedOptionKey) && selectedOptionKey.length === 1) {
      selectedOptionKey = selectedOptionKey[0]
    }

    // Find the selected option object by it's key.
    const selectedOption = findItemByKey(currentNode.options, selectedOptionKey)

    // Move to the next node.
    if (currentNode.children.length < 1) {
      // No children to move to!
      throw new NoChildrenError(currentNode)
    } else if (currentNode.children.length === 1) {
      // Move to the only child.
      return this.goToNode(currentNode.children[0])
    } else if (selectedOption && selectedOption.leadsTo) {
      // Move to what the single selected option tells us to move to.
      return this.goToNode(this.getNodeFromLeadsTo(currentNode, selectedOption))
    } else if (currentNode.leadsTo) {
      // Move to what the currentNode tells us to move to (maybe there are
      // multiple options selected).
      return this.goToNode(this.getNodeFromLeadsTo(currentNode, currentNode))
    }

    // Throw an error if the next node to move to can't be determined.
    throw new NoLeadToError(selectedOptionKey, selectedOption)
  }

  prev () {
    const parentNode = this.path[this.path.length - 2]
    if (parentNode) {
      return this.path.pop()
    }
    throw new NoParentError()
  }

  pathKeys () {
    return this.path.map(({ key }) => key)
  }
}

export {
  NoChildrenError,
  NoLeadToError,
  NoParentError,
  DecisionTree
}

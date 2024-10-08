class Tree {
  constructor(arr) {
    this.arr = arr;
    this.root = this.buildTree(arr);
  }

  buildTree(arr) {
    if (arr.length === 0) return null;
    const mid = Math.floor(arr.length / 2);
    const node = new Node(arr[mid]);
    node.left = this.buildTree(arr.slice(0, mid));
    node.right = this.buildTree(arr.slice(mid + 1));
    return node;
  }

  merge(left, right) {
    let sortedArray = [];
    while (left.length && right.length) {
      if (left[0] < right[0]) {
        sortedArray.push(left.shift());
      } else if (left[0] === right[0]) {
        left.shift(); // Remove the duplicate from the left array
        right.shift(); // Remove the duplicate from the right array
      } else {
        sortedArray.push(right.shift());
      }
    }
    return [...sortedArray, ...left, ...right];
  }

  mergeSort(arr) {
    if (arr.length <= 1) return arr;
    let mid = Math.floor(arr.length / 2);
    let left = this.mergeSort(arr.slice(0, mid));
    let right = this.mergeSort(arr.slice(mid));
    return this.merge(left, right);
  }

  mergesorted(array) {
    let sa = this.mergeSort(array);
    this.arr = sa;
    this.root = this.buildTree(sa); // Rebuild the tree with the sorted array
  }

  prettyPrint(node = this.root, prefix = "", isLeft = true) {
    if (node === null) {
      return;
    }
    if (node.right !== null) {
      this.prettyPrint(
        node.right,
        `${prefix}${isLeft ? "│   " : "    "}`,
        false
      );
    }
    console.log(`${prefix}${isLeft ? "└── " : "┌── "}${node.d}`);
    if (node.left !== null) {
      this.prettyPrint(node.left, `${prefix}${isLeft ? "    " : "│   "}`, true);
    }
  }

  insert(insNumber, node = this.root) {
    if (node === null) {
      this.root = new Node(insNumber);
      return;
    }

    if (insNumber < node.d) {
      if (node.left === null) {
        node.left = new Node(insNumber);
      } else {
        this.insert(insNumber, node.left);
      }
    } else if (insNumber > node.d) {
      if (node.right === null) {
        node.right = new Node(insNumber);
      } else {
        this.insert(insNumber, node.right);
      }
    } else {
      // insNumber === node.d, do nothing as duplicates are not allowed
      console.log("Duplicate value, not inserting:", insNumber);
    }
  }

  deleteItem(value, node = this.root, parent = null) {
    if (node === null) {
      return;
    }

    if (value > node.d) {
      this.deleteItem(value, node.right, node);
    } else if (value < node.d) {
      this.deleteItem(value, node.left, node);
    } else {
      // Node to be deleted found
      if (node.left === null && node.right === null) {
        // Case 1: Node is a leaf
        if (parent === null) {
          this.root = null; // Tree had only one node
        } else if (parent.left === node) {
          parent.left = null;
        } else {
          parent.right = null;
        }
      } else if (node.left === null) {
        // Case 2: Node has one child (right)
        if (parent === null) {
          this.root = node.right;
        } else if (parent.left === node) {
          parent.left = node.right;
        } else {
          parent.right = node.right;
        }
      } else if (node.right === null) {
        // Case 2: Node has one child (left)
        if (parent === null) {
          this.root = node.left;
        } else if (parent.left === node) {
          parent.left = node.left;
        } else {
          parent.right = node.left;
        }
      } else {
        // Case 3: Node has two children
        let successor = this.findMin(node.right);
        node.d = successor.d;
        this.deleteItem(successor.d, node.right, node);
      }
    }
  }

  findMin(node) {
    while (node.left !== null) {
      node = node.left;
    }
    return node;
  }

  find(value, root = this.root) {
    if (root === null) {
      return null; // Node not found
    }
    if (root.d === value) {
      return root; // Node found
    } else if (root.d < value) {
      return this.find(value, root.right); // Search in the right subtree
    } else {
      return this.find(value, root.left); // Search in the left subtree
    }
  }

  levelOrder(callback) {
    if (typeof callback !== "function") {
      throw new Error("A callback function is required.");
    }

    if (!this.root) {
      return;
    }

    let queue = [];
    queue.push(this.root);

    while (queue.length > 0) {
      let currentNode = queue.shift();
      callback(currentNode);

      if (currentNode.left !== null) {
        queue.push(currentNode.left);
      }

      if (currentNode.right !== null) {
        queue.push(currentNode.right);
      }
    }
  }

  inorder(node = this.root, callback) {
    if (typeof callback !== "function") {
      console.log("This ain't it");
      return;
    }

    if (node !== null) {
      this.inorder(node.left, callback); // Traverse the left subtree
      callback(node); // Visit the root node
      this.inorder(node.right, callback); // Traverse the right subtree
    }
  }

  preOrder(node = this.root, callback) {
    if (typeof callback !== "function") {
      console.log("you ain't getting it Chief");
    }

    if (node === null) {
      return;
    }

    if (node !== null) {
      callback(node.d);
      this.preOrder(node.left, callback);
      this.preOrder(node.right, callback);
    }
  }

  postOrder(node = this.root, callback) {
    if (typeof callback !== "function") {
      console.log("you ain't getting it Chief");
    }

    if (node === null) {
      return;
    }

    if (node !== null) {
      this.postOrder(node.left, callback);
      this.postOrder(node.right, callback);
      callback(node.d);
    }
  }

  height(node = this.root) {
    if (node === null) {
      return -1; // Base case: height of an empty tree is -1
    }

    // Recursively find the height of the left and right subtrees
    let leftHeight = this.height(node.left);
    let rightHeight = this.height(node.right);

    // The height of the current node is the greater of the heights of its subtrees, plus one
    return Math.max(leftHeight, rightHeight) + 1;
  }

  // depth(node, current = this.root, depth = 0) {
  //     if (current === null) {
  //         return -1; // Node not found
  //     }
  //     if (current.d === node.d) {
  //         return depth; // Node found, return the depth
  //     }

  //     // Recursively search in the left subtree
  //     let leftDepth = this.depth(node, current.left, depth + 1);
  //     if (leftDepth !== -1) {
  //         return leftDepth; // Node found in the left subtree
  //     }

  //     // Recursively search in the right subtree
  //     // let rightDepth = this.depth(node, current.right, depth + 1);
  //     // if (rightDepth !== -1) {
  //     //     return rightDepth; // Node found in the right subtree
  //     // }
  // }

  depth(node = this.root, current = this.root, depth = 0) {
    if (current === null) {
      return -1; // Node not found
    }
    if (current.d === node.d) {
      return depth; // Node found, return the depth
    }

    // Recursively search in the left and right subtrees
    let leftDepth = this.depth(node, current.left, depth + 1);
    if (leftDepth !== -1) {
      return leftDepth; // Node found in the left subtree
    }

    return this.depth(node, current.right, depth + 1); // Search in the right subtree
  }

  isBalanced(node = this.root) {
    if (node === null) {
      return true; // An empty tree is balanced
    }

    // Get the heights of the left and right subtrees
    let leftHeight = this.height(node.left);
    let rightHeight = this.height(node.right);

    // Check if the current node is balanced
    if (Math.abs(leftHeight - rightHeight) > 1) {
      return false; // The current node is not balanced
    }

    // Recursively check the balance of the left and right subtrees
    return this.isBalanced(node.left) && this.isBalanced(node.right);

  }

  reBalance(){ 
    let values = [];
    this.inorder(this.root, (node) => values.push(node.d));
    console.log(values)
    this.root = this.buildTree(values)
    this.arr = this.values 
  }
}

class Node {
  constructor(d, left = null, right = null) {
    this.d = d;
    this.left = left;
    this.right = right;
  }
}

let array = [50, 30, 70, 20, 40, 60, 80, 10, 25, 35, 45, 55, 65, 75, 85];
let tree = new Tree(array);
tree.mergesorted(tree.arr);
tree.insert(6);
tree.deleteItem(40);
tree.deleteItem(10);
tree.insert(100);
tree.insert(2222);
tree.insert(3333);
// tree.deleteItem(6);
// tree.find(60);

let node = tree.find(30);
let nodeHeight = tree.depth(node);
console.log("Height of the node with value 30:", nodeHeight);
const logNode = (value) => console.log(value);
console.log("hiya ", tree.isBalanced())
console.log(tree.arr)
tree.reBalance()
console.log("hiya ", tree.isBalanced())
tree.prettyPrint(this.root);

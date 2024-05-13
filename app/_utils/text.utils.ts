export const clampMiddle = (str: string, edgeLength = 6, rightEdgeLength = edgeLength, delimiter = '...') =>
  `${str.substring(0, edgeLength)}${
    str.length > edgeLength + rightEdgeLength ? delimiter : ''
  }${str.substring(str.length - rightEdgeLength)}`;

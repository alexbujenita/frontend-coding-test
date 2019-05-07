const add = (a, b, ...params) => [a, b, ...params].reduce((acc, sum) => acc + sum );

const objectToList = input => {
  const obj = JSON.parse(JSON.stringify(input));
  let list = [];
  Object.keys(obj).forEach(key => {
    list.push({name: key, value: obj[key]});
  })
  return list;
}

const listToObject = (list) => {
  let newObj = {};
  const newList = JSON.parse(JSON.stringify(list));
  newList.forEach(obj =>  newObj[obj.name] = obj.value);
  return newObj;
}


const dateUNIX = (date) => {
  const dateFormat = new Date(date);
  const month = dateFormat.getMonth()+1;
  const monthFormat = month < 10 ? `0${month}` : month;
  return `${dateFormat.getDate()}/${monthFormat}/${dateFormat.getFullYear()}`;
}

const deserialize = (obj) => {
  const newObject = {};
  const newObj = JSON.parse(JSON.stringify(obj));

  Object.keys(obj).forEach(key => {
    const split_key = key.split("_");
    const propNames = split_key[0].match(/[a-zA-Z]+|[0-9]+/g)
    if(!newObject.hasOwnProperty(propNames[0])) {
      newObject[propNames[0]] = [];
    }
    if(split_key.length === 1) {
      newObject[propNames[0]] = obj[key];
    } else {

      if(!newObject[propNames[0]][propNames[1]]){
        newObject[propNames[0]][propNames[1]] = {}
      }

      if (typeof obj[key] === 'object') {
        newObject[propNames[0]][propNames[1]][split_key[1]] = deserialize(obj[key])
      } else {

        if(typeof obj[key] === 'string' && obj[key].includes('t:')) {
          const date = dateUNIX(parseInt(obj[key].split(':')[1]))
          newObject[propNames[0]][propNames[1]][split_key[1]] = date;
        } else {
          newObject[propNames[0]][propNames[1]][split_key[1]] = obj[key]
        }
      }
    }
  })
  return newObject
}




module.exports = { add, objectToList, listToObject, deserialize, dateUNIX }

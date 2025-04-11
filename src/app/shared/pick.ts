const pick = <T extends Record<String, unknown>, K extends keyof T>(
    obj: T,
    keys: K[]
  ): Partial<T> => {
    // console.log(obj, keys);
  
    const finalObj: Partial<T> = {};
  
    for (const key of keys) {
      if (obj && Object.hasOwnProperty.call(obj, key)) {
        // console.log(key);
        finalObj[key] = obj[key];
      }
    }
  
    console.log("Final Obj", finalObj);
    return finalObj;
  };

  export default pick;
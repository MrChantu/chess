class utils {
    static compareArrays(arr1: [], arr2: []) {
        return JSON.stringify(arr1) === JSON.stringify(arr2);
    }

    static arrayContains(arr: Array<number[]>, targetArray: number[]) {
        return arr.some((subArray) => {
            return (
                subArray[0] === targetArray[0] && subArray[1] === targetArray[1]
            );
        });
    }
}

export default utils;

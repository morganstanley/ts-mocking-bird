export const functionOneReturnValue = 'sampleFunctionOneImport';
export const functionTwoReturnValue = 'sampleFunctionTwoImport';
export const functionThreeReturnValue = 'sampleFunctionThreeImport';
export const classReturnValue = 'sampleClassImport';

export function sampleFunctionOne() {
    return functionOneReturnValue;
}

export function sampleFunctionTwo() {
    return functionTwoReturnValue;
}

export function sampleFunctionThree() {
    return functionThreeReturnValue;
}

export class SampleClassImport {
    public sampleFunction() {
        return classReturnValue;
    }
}

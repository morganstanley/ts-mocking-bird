export let functionOneReturnValue: string = 'sampleFunctionOneImport';
export let functionTwoReturnValue: string = 'sampleFunctionTwoImport';
export let functionThreeReturnValue: string = 'sampleFunctionThreeImport';
export let classReturnValue: string = 'sampleClassImport';

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

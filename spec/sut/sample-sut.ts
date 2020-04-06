import { SampleClassImport, sampleFunctionOne, sampleFunctionThree, sampleFunctionTwo } from './sample-import';

export class SampleClass {
    public wrapFunctionOne() {
        return sampleFunctionOne();
    }

    public wrapFunctionTwo() {
        return sampleFunctionTwo();
    }

    public wrapFunctionThree() {
        return sampleFunctionThree();
    }

    public valueFromClass() {
        return new SampleClassImport().sampleFunction();
    }
}

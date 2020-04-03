// tslint:disable:ordered-imports
import { sampleFunctionOne, sampleFunctionTwo, sampleFunctionThree, SampleClassImport } from './sample-import';

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

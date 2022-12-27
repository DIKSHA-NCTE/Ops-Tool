import { ValidatorFn, AbstractControl, ValidationErrors } from '@angular/forms';


export const validateUniqueConstantComb = (srcData: any): ValidatorFn => {
    return (control: AbstractControl): ValidationErrors | null => {
        const field1 = control.get('field_name');
        const field2 = control.get('field_value');

        let isCombNotUnique = false;
        if (field1 && field1.value && field2 && field2.value) {
            srcData.data.find((obj: any) => {
                if (obj.name === field1.value && obj.value == field2.value) {
                    isCombNotUnique = true;
                }
            });
        }

        return isCombNotUnique ? { uniqueConstantComb: isCombNotUnique } : null;
    };
} 

export const atLeastOneValidator = () => {
    return (controlGroup: any) => {
        let controls = controlGroup.controls;
        if ( controls ) {
            let theOne = Object.keys(controls).find((key) => (controls[key].value !== '' && controls[key].value !== null && controls[key].value !== undefined));
            if ( !theOne ) {
                return {
                    atLeastOneRequired : {
                        text : 'At least one should be selected'
                    }
                }
            }
        }
        return null;
    };
};

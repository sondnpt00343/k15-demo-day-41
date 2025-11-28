import { useState } from "react";

function useFormValues(initialValues = {}) {
    const [formValues, setFormValues] = useState(initialValues);

    const setFieldValue = (e) => {
        setFormValues({
            ...formValues,
            [e.target.name]: e.target.value,
        });
    };

    return [formValues, setFieldValue, setFormValues];
}

export default useFormValues;

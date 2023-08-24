import React, { useState } from 'react'
import { Heading, Text, TextEm, Button } from '@components'
import { styled } from '@theme'
import { FormHeader, BasicInput, FileInput, SelectInput } from './Parts'
import { XyzTransition } from '@animxyz/react'

// For the master container of the form, within the Apply for Job section
// This holds all of the questions needed to be supplied when applying for a position

const FormWrap = styled('div', {
  position: 'relative',
  width: '100%',
  background: '$bgPrimary'
})

// For the container of all of the content within the master container
// This holds all of the titles and the input forms

const FormContent = styled('div', {
  position: 'relative',
  maxWidth: 800,
  width: '90%',
  margin: '0 auto',
  padding: '150px 0 50px',
  '> *:not(:last-child)': { marginBottom: 50 },
  '@mobile': { padding: '75px 0 20px' }
})

// For the container of all of the inputs within the form
// This is mainly used to automate the spacing between each of the inputs within the container

const InputContainer = styled('div', {
  position: 'relative',
  width: '100%',
  '> *:not(:last-child)': { marginBottom: 12 }
})

const Checkboxes = styled('div', {
  display: 'flex',
  flexDirection: 'column',
  width: '100%',
  marginTop: 50,
  '> *:not(:last-child)': { marginBottom: 12 },

  input: {
    position: 'relative',
    width: 32,
    height: 32,
    borderRadius: '$r0',
    border: '1px solid $border',
    appearance: 'none'
  }
})

const InputCheckbox = styled('div', {
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'flex-end',
  flexDirection: 'row-reverse',
  position: 'relative',
  '> *:not(:last-child)': { marginLeft: 8 }
})

interface Field {
  name: string;
  type: 'input_text' | 'input_file' | 'textarea' | 'multi_value_multi_select' | 'multi_value_single_select'
  values: any[];
}

interface Question {
  description: string | null;
  label: string;
  required: boolean;
  fields: Field[];
  value: string;
}

export const JobApplyForm: React.FC<{ questions: Question[], compliance: any[] }> = ({ questions, compliance }) => {
  const [ values, setValues ] = useState<{[ key: string ]: any }>({});

  const filteredCompliance = compliance.filter((complianceItem: { questions: Question[] }) => {
    return complianceItem.questions.some((question: Question) => 
        question.label.includes('Race') || question.label.includes('Gender')
    );
  });

  const handleInputChange = (questionIndex: number, fieldIndex: number, value: any) => {
    setValues(prevValues => ({
      ...prevValues,
      [`${questionIndex}-${fieldIndex}`]: value
    }));
  }

  const RenderQuestion = ({ question, questionIndex }: { question: Question, questionIndex: number }) => {
    return (

      <div key={`question-${ questionIndex }`}>
        { question.fields.map(( field, fieldIndex ) => {
          const inputName = `${ questionIndex }-${ fieldIndex }`;
          switch ( field.type ) {
            case "input_text" :
            return (

              <BasicInput 
                key={ fieldIndex }
                active={ Boolean( values[`${questionIndex}-0`] )}
                label={ question.label }
                name={ field.name }
                required={ question.required }
                value={ values[ inputName ] || '' }
                onChange={(e: any) => handleInputChange( questionIndex, fieldIndex, e.target.value )}
              />

            )
            
            case "input_file" :
            return (

              <FileInput 
                key={ fieldIndex }
                required={ question.required }
                label={ question.label }
                name={ field.name }
              />

            )

            case "multi_value_single_select":
            return (

              <SelectInput 
                defaultValue="Select"
                label={ question.label }
                name={ question.label }
                options={ field.values.map( option => ({
                  title: option.label, 
                  value: option.value 
                }))}
              />

            )

            case "multi_value_multi_select":
            return (

              <Checkboxes key={ fieldIndex }>
                <fieldset>
                  <Heading title={ question.label } />
                  { question.required && <TextEm color="danger">*</TextEm> }
                </fieldset>

                <div>
                  { field.values.map(( option, optionIndex ) => (
                    <InputCheckbox key={ optionIndex }>
                      <label>{ option.label }</label>
                      <input 
                        type="checkbox"
                        name={field.name}
                        value={option.value}
                        onChange={e => {
                          const updatedValues = (values[inputName] || []).slice();
                          if (e.target.checked) {
                            updatedValues.push(option.value);
                          } else {
                            const index = updatedValues.indexOf(option.value);
                            if (index > -1) {
                              updatedValues.splice(index, 1);
                            }
                          }
                          handleInputChange(questionIndex, fieldIndex, updatedValues);
                        }}
                        checked={(values[inputName] || []).includes(option.value)}
                      />
                    </InputCheckbox>
                  ))}
                </div>
              </Checkboxes>
            )
            
            default:
            return null;
          }
        })}
      </div>
    )
  }

  return (

    <FormWrap id="apply-now">
      <XyzTransition xyz="fade down delay-15 duration-15" appear>

        <FormContent>
          <FormHeader title="Apply for this job" />

          <InputContainer>
          {questions.map((question, i) => (
              <div key={`question-${i}`}>
                {question.fields.map((field, fieldIndex) => {
                  const inputName = `${ i }-${ fieldIndex }`
                  switch ( field.type ) {
                    case "input_text" :
                    return (

                      <BasicInput 
                        key={ fieldIndex }
                        active={ Boolean( values[`${ i }-0`] )}
                        label={ question.label }
                        name={ field.name }
                        required={ question.required }
                        value={ values[ inputName ] || '' }
                        onChange={ (e:any) => handleInputChange( i, fieldIndex, e.target.value ) }
                      />

                    )
                  
                    case "input_file" :
                    return (
                      
                      <FileInput 
                        key={ fieldIndex }
                        required={ question.required }
                        label={ question.label }
                        name={ field.name }
                      />
                    
                    )

                    case "multi_value_single_select" :
                    return (
                      
                      <SelectInput 
                        defaultValue="Select"
                        label={ question.label }
                        name={ question.label }
                        options={field.values.map(option => ({
                          title: option.label, // Transforming `label` to `title`
                          value: option.value  // Optional if SelectInput also expects `value`, else you can omit this
                        }))}
                      />
                    
                    )

                    // case "textarea":
                    // return (
                    //   <textarea 
                    //     key={fieldIndex} 
                    //     name={field.name} 
                    //     required={ false } 
                    //     value={values[inputName] || ''}
                    //     onChange={e => handleInputChange(i, fieldIndex, e.target.value)}
                    //   ></textarea>
                    // )
                  
                    case "multi_value_multi_select":
                      return (

                        <Checkboxes key={ fieldIndex }>
                          <fieldset>
                            <Heading title={ question.label } />
                            { question.required && <TextEm color="danger">*</TextEm> }
                          </fieldset>

                          <div>
                            { field.values.map((option, optionIndex) => (
                              <InputCheckbox key={optionIndex}>
                                <label>{option.label}</label>
                                <input 
                                  type="checkbox"
                                  name={field.name}
                                  value={option.value}
                                  onChange={e => {
                                    // Handle multi-value selection
                                    const updatedValues = (values[inputName] || []).slice();
                                    if (e.target.checked) {
                                      updatedValues.push(option.value);
                                    } else {
                                      const index = updatedValues.indexOf(option.value);
                                      if (index > -1) {
                                        updatedValues.splice(index, 1);
                                      }
                                    }
                                    handleInputChange(i, fieldIndex, updatedValues);
                                  }}
                                  checked={(values[inputName] || []).includes(option.value)}
                                />
                              </InputCheckbox>
                            ))}
                          </div>
                        </Checkboxes>

                      )

                    default:
                    return null;
                  }
                })}
              </div>
            ))}
          </InputContainer>

          <Text>
            <Heading bold="heavy" size="l2" title="US Equal Opportunity Employer Statement" />

            <p>
              Continuum Capital is an equal opportunity employer that is commited to diversity and inclusion in the workplace. We 
              prohibit discrimination and harassment of any kind based on race, color, sex, religion, sexual orientation, national origin, 
              disability, genetic information, pregnancy, or any other protected characteristic as outlined by federal, state, or local laws.
            </p>

            <p>
              This policy applies to all employment practices within our organization, including hiring, recruiting, promotion, termination,
              layoff, recall, leave of absence, compensation, benefits, training, and apprenticeship. Continuum Capital makes hiring 
              decisions based solely on qualifications, merit, and business needs at the time.
            </p>
          </Text>
          
          
          { filteredCompliance.map(( complianceItem, index ) => (
            <div key={`compliance-${ index }`}>
              <InputContainer>
                { complianceItem.questions && complianceItem.questions.map(( nestedQuestion:any, nestedQuestionIndex:any ) => (
                  <RenderQuestion 
                    question={ nestedQuestion } 
                    questionIndex={ nestedQuestionIndex } 
                    key={ nestedQuestionIndex } 
                  />
                ))}
              </InputContainer>
            </div>
          ))}
          
          <Button variant="primary" type="submit" title="Submit Application" />
        </FormContent>
      </XyzTransition>
      
    </FormWrap>

  ) 
}

export default JobApplyForm

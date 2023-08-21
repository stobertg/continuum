import React, { useState, useEffect } from 'react';
import { styled } from '@theme'
import { useRouter } from 'next/router';
import type { NextPage } from 'next';
import { SiteContainer, Heading, HeroTitle, ReadingBar, JobDetails, Button, Text, TextEm } from '@components';

interface Field {
  name: string;
  type: 'input_text' | 'input_file' | 'textarea' | 'multi_value_multi_select';  // Added the new type here
  values: any[];  // Update this if you know the exact values type
}

interface Question {
  description: string | null;
  label: string;
  required: boolean;
  fields: Field[];
  value: string
}


interface JobDetail {
  id: string
  title: string
  content: string
  location: {
    name: string
  }
  metadata: {
    name?: string
    value: string
  }[]
  questions: Question[];
}

const FormWrap = styled('div', {
  position: 'relative',
  width: '100%',
  background: '$bgPrimary'
})

const FormContent = styled('div', {
  position: 'relative',
  maxWidth: 800,
  width: '90%',
  margin: '0 auto',
  padding: '150px 0',
  '> *:not(:last-child)': { marginBottom: 50 }
})

const InputContainer = styled('div', {
  position: 'relative',
  width: '100%',
  '> *:not(:last-child)': { marginBottom: 12 }
})

const Input = styled('div', {
  display: 'flex',
  flexDirection: 'row',
  alignItems: 'center',
  position: 'relative',
  width: '100%',
  height: 60,
  padding: '0 20px',
  border: '1px solid $border',
  borderRadius: '$r1',
  transition: '$s1',

  label: {
    display: 'flex',
    flexDirection: 'row',
    position: 'relative',
    width: '100%',
    transformOrigin: 'top left',
    transition: '$s1'
  },

  input: {
    position: 'absolute',
    top: 0,
    left: 0,
    width: '100%',
    height: '100%',
    padding: '14px 20px 0',
    outline: 'none',
    border: 'none',
    background: 'none',
    appearance: 'none',
    fontFamily: '$sansSerifBold',
    fontSize: '$s1'
  },

  '&:focus-within': {
    borderColor: '$contentColor',
    label: {
      '&, *': { color: '$textSecondary !important' },
      transform: 'translateY( -10px ) scale( 0.8 )'
    }
  },

  variants: {
    active: {
      true: {
        label: {
          '&, *': { color: '$textSecondary !important' },
          transform: 'translateY( -10px ) scale( 0.8 )'
        }
      }
    }
  }
})

const FormHeader = styled('div', {
  display: 'flex',
  flexDirection: 'row',
  alignItems: 'center',
  justifyContent: 'space-between',
  position: 'relative',
  width: '100%'
})

const Required = styled('div', {
  display: 'flex',
  flexDirection: 'row',
  '> *:not(:last-child)': { marginRight: 12 }
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


const Home: NextPage = () => {
  const router = useRouter()
  const { id } = router.query
  const [ jobDetail, setJobDetail ] = useState<JobDetail | null>(null)
  const [ error, setError ] = useState<string | null>(null)

  useEffect(() => {
    const fetchData = async () => {
      if (id) {
        try {
          const res = await fetch(`/api/jobPost?id=${id}`)
          const result = await res.json()
  
          if (res.ok) {
            setJobDetail(result)
          } else {
            setError(result.message || 'An error occurred')
          }
        } catch (error) {
          setError('An error occurred while fetching data')
        }
      }
    }
  
    fetchData()
  }, [ id ])  

  console.log( jobDetail )
  
  const QuestionForm: React.FC<{ questions: Question[] }> = ({ questions }) => {
    // Use a state to store values for each question and field
    const [values, setValues] = useState<{ [key: string]: any }>({});
  
    const handleInputChange = (questionIndex: number, fieldIndex: number, value: any) => {
      setValues(prevValues => ({
        ...prevValues,
        [`${questionIndex}-${fieldIndex}`]: value
      }));
    }
  
    return (
      <FormWrap>
        <FormContent>
          <FormHeader>
            <Heading bold="heavy" size="l3" title="Apply for this job" />
            <Required>
              <TextEm color="danger">*</TextEm>
              <Heading size="l0" title="Required" />
            </Required>
          </FormHeader>

          <InputContainer>
            { questions.map(( question, i ) => (
              <div key={`question-${ i }`}>
                {/* <label><Heading title={ question.label } /></label> */}

                { question.fields.map((field, fieldIndex) => {
                  const inputName = `${i}-${fieldIndex}`;
                  switch (field.type) {
                    case "input_text" :
                      return (

                        <Input active={ Boolean(values[`${ i }-0`]) }>
                          <label>
                            <Heading title={ question.label } />
                            {question.required && <TextEm color="danger">*</TextEm>}
                          </label>

                          <input
                            key={ fieldIndex }
                            type="text"
                            name={ field.name }
                            required={ question.required }
                            value={ values[ inputName ] || '' }
                            onChange={ e => handleInputChange( i, fieldIndex, e.target.value ) }
                          />
                        </Input>

                      )
                  
                    case "input_file":
                      return (
                        <>
                          <label>
                            <Heading title={ question.label } />
                            {question.required && <TextEm color="danger">*</TextEm>}
                          </label>

                          <input key={fieldIndex} type="file" name={field.name} required={question.required} />
                        </>
                      )

                    case "textarea":
                      return (
                        <textarea 
                          key={fieldIndex} 
                          name={field.name} 
                          required={question.required} 
                          value={values[inputName] || ''}
                          onChange={e => handleInputChange(i, fieldIndex, e.target.value)}
                        ></textarea>
                      )
                  
                    case "multi_value_multi_select":
                      return (
                        <Checkboxes key={fieldIndex}>
                          <fieldset>
                            <Heading title={ question.label } />
                            {question.required && <TextEm color="danger">*</TextEm>}
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
  
          <Button variant="primary" type="submit" title="Submit" />
        </FormContent>
      </FormWrap>
    );
  };
  
  
  
  return (
    <SiteContainer removeBlob removeContact>
      <ReadingBar />
      <HeroTitle 
        title={ jobDetail?.title }
        location={ jobDetail?.location.name }
        backLink="/careers"
      />

      <JobDetails 
        descp={ jobDetail?.content } 
        responsibilities={ jobDetail?.metadata[1].value }
        requirements={ jobDetail?.metadata[2].value }
      />

      {jobDetail?.questions && 
        <QuestionForm questions={jobDetail.questions} />
      }
    </SiteContainer>
  );
}

export default Home;

'use client'
import * as React from 'react';
import { FAQModel } from './FAQ.model';
import { Accordion, AccordionSummary, AccordionDetails } from '@mui/material';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';

export interface FAQComponentProps {
    model: FAQModel[];
}

export const FAQComponent = (props: FAQComponentProps) => {
    const [expanded, setExpanded] = React.useState<string | false>(false);
    const handleChange =
      (panel: string) => (event: React.SyntheticEvent, isExpanded: boolean) => {
        setExpanded(isExpanded ? panel : false);
      };
  
    const RenderFAQ = (c: FAQModel, index: number) => {
        const newIndex = (index + 1);
            
        return <div key={`faq-section${newIndex}`} className="faq-section">
          <Accordion key={`faq-${newIndex}`} expanded={expanded === c.id} onChange={handleChange(c.id)}>
            <AccordionSummary key={`faq-summary${newIndex}`} expandIcon={<ExpandMoreIcon />} aria-controls={c.id} id={c.id}>
            {
              <div key={`faq-title${newIndex}`} className="faq-title" dangerouslySetInnerHTML={{__html: c.title}}></div>
            }
            </AccordionSummary>
            <AccordionDetails>
              <div key={`faq-description${newIndex}`} className="faq-description" dangerouslySetInnerHTML={{__html: c.description}}>
              </div>    
            </AccordionDetails>
          </Accordion>
        </div>
    }

    return <div key={`faq-section`} className="faq-section">
        {props.model && Array.isArray(props.model) && 
          props.model.map((c, index) => RenderFAQ(c, index))
        }  
    </div>
}

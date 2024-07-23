import { PillsInput, Pill } from "@mantine/core"
import { useState } from "react"

export const Skills = () => {
    const [tags, setTags] = useState(['React', 'Vue', 'HTML'])

  return (
    <PillsInput label="Add Skills">
        <Pill.Group>
            {tags.map((tag, index) => {
                <Pill key={index}>{tag}</Pill>
            })}
        </Pill.Group>
    </PillsInput>
    
  )
}

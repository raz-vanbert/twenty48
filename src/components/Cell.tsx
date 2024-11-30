import { CellInterface } from "@/types";
import { getCellBgColor } from "@/utilities";
import { Box, Center } from "@chakra-ui/react";

interface CellProps {
  cell: CellInterface;
}
export default function Cell({ cell }: CellProps) {
  return (
    <Center
      w="68px"
      h="68px"
      bg={getCellBgColor(cell.value)}
      color="black"
      position="absolute"
      border="4px solid gray.700"
      borderRadius="4px"
      transform={`translate(${cell.column * 68}px, ${cell.row * 68}px)`}
      transition={`transform 0.2s`}
    >
      <Box as="span" fontWeight="bold" fontSize="md">
        {cell.value === 0 ? "" : cell.value}
      </Box>
    </Center>
  );
}

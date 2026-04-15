import { useState, useEffect } from "react";
import { useTranslation } from "react-i18next";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { ScrollArea, ScrollBar } from "@/components/ui/scroll-area";
import { Plus, X, Table as TableIcon, Trash2 } from "lucide-react";

interface InsertTableDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onInsert: (html: string) => void;
}

export function InsertTableDialog({ open, onOpenChange, onInsert }: InsertTableDialogProps) {
  const { t } = useTranslation('noteEditPage');
  const [tableData, setTableData] = useState<string[][]>([
    ["", "", ""],
    ["", "", ""],
    ["", "", ""],
  ]);

  const rowCount = tableData.length;
  const colCount = tableData[0]?.length || 0;

  // Reset when open becomes true if it was false
  useEffect(() => {
    if (open) {
      setTableData([
        ["", "", ""],
        ["", "", ""],
        ["", "", ""],
      ]);
    }
  }, [open]);

  const handleCellChange = (r: number, c: number, value: string) => {
    const newData = [...tableData];
    newData[r] = [...newData[r]];
    newData[r][c] = value;
    setTableData(newData);
  };

  const addRow = () => {
    setTableData([...tableData, Array(colCount).fill("")]);
  };

  const addCol = () => {
    setTableData(tableData.map((row) => [...row, ""]));
  };

  const removeRow = (index: number) => {
    if (rowCount <= 1) return;
    setTableData(tableData.filter((_, i) => i !== index));
  };

  const removeCol = (index: number) => {
    if (colCount <= 1) return;
    setTableData(tableData.map((row) => row.filter((_, i) => i !== index)));
  };

  const generateHTML = () => {
    let html = '<table border="1">\n';

    tableData.forEach((row, r) => {
      const isHeaderRow = r === 0;
      html += "  <tr>\n";
      row.forEach((cell) => {
        const tag = isHeaderRow ? "th" : "td";
        html += `    <${tag}>${cell || ""}</${tag}>\n`;
      });
      html += "  </tr>\n";
    });

    html += "</table>";
    onInsert(html);
    onOpenChange(false);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent
        className="sm:max-w-[80vw] w-[95vw] h-[90vh] max-h-[90vh] flex flex-col p-0 gap-0 overflow-hidden"
        onPointerDownOutside={(e) => e.preventDefault()}
        onEscapeKeyDown={(e) => e.preventDefault()}
        showCloseButton={false}
      >
        <DialogHeader className="p-6 border-b bg-muted/30">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <div className="p-2 bg-primary/10 rounded-md">
                <TableIcon className="w-5 h-5 text-primary" />
              </div>
              <DialogTitle className="text-xl">{t('insertTable.title')}</DialogTitle>
            </div>
            <Button
              variant="ghost"
              size="icon"
              onClick={() => onOpenChange(false)}
              className="rounded-full"
            >
              <X className="h-4 w-4" />
            </Button>
          </div>

          <div className="flex items-center gap-6 mt-4">
            <div className="text-xs text-muted-foreground ml-auto uppercase tracking-wider font-semibold">
              {rowCount} {t('insertTable.rows')} x {colCount} {t('insertTable.cols')}
            </div>
          </div>
        </DialogHeader>

        <div className="flex-1 overflow-hidden relative group bg-background">
          <ScrollArea className="h-full w-full">
            <div className="p-8">
              <div className="inline-block min-w-full border rounded-lg shadow-sm bg-muted/5 relative">
                <table className="border-collapse w-full">
                  <thead>
                    <tr>
                      <th className="w-8"></th>
                      {Array.from({ length: colCount }).map((_, c) => (
                        <th key={c} className="p-1 pb-2">
                          <Button
                            variant="ghost"
                            size="icon"
                            className="h-6 w-full hover:text-destructive hover:bg-destructive/10 transition-colors"
                            onClick={() => removeCol(c)}
                            title={t('insertTable.removeCol')}
                            disabled={colCount <= 1}
                          >
                            <Trash2 className="h-3 w-3" />
                          </Button>
                        </th>
                      ))}
                      <th className="w-12"></th>
                    </tr>
                  </thead>
                  <tbody>
                    {tableData.map((row, r) => (
                      <tr key={r} className="group/row">
                        <td className="p-1 pr-2">
                          <Button
                            variant="ghost"
                            size="icon"
                            className="h-6 w-6 hover:text-destructive hover:bg-destructive/10 transition-colors"
                            onClick={() => removeRow(r)}
                            title={t('insertTable.removeRow')}
                            disabled={rowCount <= 1}
                          >
                            <Trash2 className="h-3 w-3" />
                          </Button>
                        </td>
                        {row.map((cell, c) => {
                          const isHeader = r === 0;

                          return (
                            <td key={c} className="p-1 min-w-[140px]">
                              <Input
                                value={cell}
                                onChange={(e) => handleCellChange(r, c, e.target.value)}
                                placeholder={isHeader ? t('insertTable.placeholder.header') : t('insertTable.placeholder.cell')}
                                className={`h-10 text-sm focus-visible:ring-1 transition-colors ${isHeader
                                  ? "bg-primary/5 font-semibold border-primary/20"
                                  : "bg-background"
                                  }`}
                              />
                            </td>
                          );
                        })}
                        {/* Right side add column indicator / spacer */}
                        {r === 0 && (
                          <td rowSpan={rowCount} className="p-1 pl-4 align-middle">
                            <Button
                              variant="secondary"
                              size="icon"
                              onClick={addCol}
                              className="h-10 w-10 rounded-full shadow-md border hover:scale-110 transition-transform bg-background"
                              title={t('insertTable.addCol')}
                            >
                              <Plus className="h-5 w-5" />
                            </Button>
                          </td>
                        )}
                      </tr>
                    ))}
                    {/* Bottom side add row row */}
                    <tr>
                      <td className="p-1 pt-4 text-center" colSpan={colCount + 1}>
                        <Button
                          variant="secondary"
                          size="icon"
                          onClick={addRow}
                          className="h-10 w-10 rounded-full shadow-md border hover:scale-110 transition-transform bg-background"
                          title={t('insertTable.addRow')}
                        >
                          <Plus className="h-5 w-5" />
                        </Button>
                      </td>
                      <td></td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </div>
            <ScrollBar orientation="horizontal" />
            <ScrollBar orientation="vertical" />
          </ScrollArea>
        </div>

        <DialogFooter className="p-6 border-t bg-muted/30">
          <div className="flex gap-2 ml-auto">
            <Button variant="outline" onClick={() => onOpenChange(false)}>
              {t('insertTable.cancel')}
            </Button>
            <Button onClick={generateHTML} className="px-8 font-semibold">
              {t('insertTable.insert')}
            </Button>
          </div>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}

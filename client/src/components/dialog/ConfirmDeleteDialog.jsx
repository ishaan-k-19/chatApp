import {
  AlertDialog,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogHeader,
  AlertDialogTitle
} from "@/components/ui/alert-dialog"
import { Button } from '../ui/button'

const ConfirmDeleteDialog = ({open, handleClose, deleteHandler}) => {
  return (
    <div>
      <AlertDialog open={open} onOpenChange={handleClose}>
      <AlertDialogContent>
        <AlertDialogHeader>
          <div className="flex flex-col items-center">
            <AlertDialogTitle className="text-center text-3xl py-5">
              Confirm Delete
            </AlertDialogTitle>
            <AlertDialogDescription className="flex flex-col items-center">
                Are you sure you want to delete this group?
                <div className="flex gap-4 pt-6">
                <Button className="border border-neutral-200" variant='secondary' onClick={handleClose}>No</Button>
                <Button variant='destructive' onClick={deleteHandler}>Yes</Button>
                </div>
            </AlertDialogDescription>
          </div>
          
        </AlertDialogHeader>
      </AlertDialogContent>
    </AlertDialog>
    </div>
  )
}

export default ConfirmDeleteDialog

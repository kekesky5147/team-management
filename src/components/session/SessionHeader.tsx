'use client'

import { RotateCcw, Star, Users } from 'lucide-react'
import { useState } from 'react'

import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle
} from '@/components/ui/alert-dialog'
import { Button } from '@/components/ui/button'
import {
  appleBadge,
  appleDialogContent,
  appleGhostButton,
  appleTitle,
  appleTouchIconButton
} from '@/lib/apple-ui'
import { cn } from '@/lib/utils'

type SessionHeaderProps = {
  totalCount: number
  onReset: () => void
  onOpenFavorites: () => void
}

const mobileHeaderIconButton = cn(
  appleTouchIconButton,
  'bg-white/8 text-neutral-200 active:bg-white/12'
)

function HeaderActions ({
  totalCount,
  onOpenFavorites,
  onResetClick,
  mobile = false
}: {
  totalCount: number
  onOpenFavorites: () => void
  onResetClick: () => void
  mobile?: boolean
}) {
  if (mobile) {
    return (
      <>
        <Button
          type='button'
          variant='ghost'
          className={mobileHeaderIconButton}
          onClick={onOpenFavorites}
          aria-label='자주 쓰는 선수'
        >
          <Star className='size-4' />
        </Button>

        <div
          className={cn(mobileHeaderIconButton, 'w-auto min-w-11 gap-1 px-2.5')}
          aria-label={`전체 출석 ${totalCount}명`}
          title={`전체 출석 ${totalCount}명`}
        >
          <Users className='size-4 shrink-0 text-neutral-300' />
          <span className='text-xs font-semibold tabular-nums text-neutral-200'>
            {totalCount}
          </span>
        </div>

        <Button
          type='button'
          variant='ghost'
          className={mobileHeaderIconButton}
          onClick={onResetClick}
          aria-label='전체 초기화'
        >
          <RotateCcw className='size-4' />
        </Button>
      </>
    )
  }

  return (
    <>
      <Button
        type='button'
        variant='ghost'
        className={appleGhostButton}
        onClick={onOpenFavorites}
        aria-label='자주 쓰는 선수'
      >
        <Star className='size-4' />
        자주 쓰는 선수
      </Button>

      <div className={cn(appleBadge, 'flex min-h-12 items-center gap-2 px-4')}>
        <Users className='size-4 text-neutral-400' />
        전체 출석 {totalCount}명
      </div>

      <Button
        type='button'
        variant='ghost'
        className={appleGhostButton}
        onClick={onResetClick}
      >
        <RotateCcw className='size-4' />
        전체 초기화
      </Button>
    </>
  )
}

export function SessionHeader ({
  totalCount,
  onReset,
  onOpenFavorites
}: SessionHeaderProps) {
  const [resetOpen, setResetOpen] = useState(false)

  const handleResetOpenChange = (open: boolean) => {
    setResetOpen(open)
  }

  const handleReset = () => {
    onReset()
    setResetOpen(false)
  }

  return (
    <header className='flex flex-col gap-5 sm:flex-row sm:items-center sm:justify-between sm:gap-8'>
      <div className='flex min-w-0 items-center justify-between gap-2 sm:flex-1'>
        <h1 className={cn(appleTitle, 'ml-8 min-w-0 shrink leading-tight')}>
          LV Tigers
        </h1>

        <div className='flex shrink-0 items-center gap-1 sm:hidden'>
          <HeaderActions
            mobile
            totalCount={totalCount}
            onOpenFavorites={onOpenFavorites}
            onResetClick={() => setResetOpen(true)}
          />
        </div>
      </div>

      <div className='hidden flex-wrap items-center gap-3 sm:flex'>
        <HeaderActions
          totalCount={totalCount}
          onOpenFavorites={onOpenFavorites}
          onResetClick={() => setResetOpen(true)}
        />
      </div>

      <AlertDialog open={resetOpen} onOpenChange={handleResetOpenChange}>
        <AlertDialogContent className={appleDialogContent}>
          <AlertDialogHeader>
            <AlertDialogTitle className='text-neutral-100'>
              전체 초기화
            </AlertDialogTitle>
            <AlertDialogDescription className='font-light text-neutral-400'>
              출석 및 팀 배정 데이터를 모두 삭제할까요? 이 작업은 되돌릴 수
              없습니다.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel className='min-h-11 rounded-xl border-0 bg-white/8 text-neutral-200 hover-hover:bg-white/12'>
              취소
            </AlertDialogCancel>
            <AlertDialogAction
              variant='destructive'
              onClick={handleReset}
              className='rounded-xl active:scale-95'
            >
              초기화
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </header>
  )
}
